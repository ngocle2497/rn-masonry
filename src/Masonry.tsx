import React, { memo, useState, useEffect, useCallback } from 'react'
import { StyleSheet, View, FlatList, LayoutChangeEvent, Image } from 'react-native'
import isEqual from 'react-fast-compare'
import { MasonryProps, Dimensions, ItemColumn } from './types'
import { DEFAULT_COLUMNS, DEFAULT_CELL_SPACE } from './constants'
import { assignObjectColumn, assignObjectIndex } from './handle'
import { Column } from './Column'

const MasonryComponent = ({ data = [], onEndReach, columns = DEFAULT_COLUMNS, space = DEFAULT_CELL_SPACE, onPress, customImageComponent, customImageProps, renderFooter, renderHeader }: MasonryProps) => {
    const [dimensions, setDimensions] = useState<Dimensions>({ height: 0, width: 0 })
    const [dataSource, setDataSource] = useState<Array<ItemColumn[]>>([])

    /**
     * Convert data to multi array to multi column
     */
    const _formatData = () => {
        if (data.length == 0) {
            setDataSource([]);
            return;
        }
        const offset = dataSource.length > 0 ? data.length : 0

        let newData: Array<ItemColumn[]> = dataSource;

        const dataOf = data.map((cell, index) => assignObjectColumn(columns, index, cell)).map((cell, index) => assignObjectIndex(offset + index, cell))

        for (const element of dataOf) {
            Image.getSize(element.uri, (width, height) => {
                const dataConcat = _insertIntoColumn({
                    ...element, dimensions: {
                        width,
                        height
                    }
                }, newData);
                newData = dataConcat
                setDataSource(dataConcat)
            }, (error) => {
                console.error('Image failed to load')
            });
        }

    }

    /**
     * Insert or concat image to array image of column
     * @returns Array
     */
    const _insertIntoColumn = (img: ItemColumn, dataSet: Array<ItemColumn[]>) => {
        let dataCopy = dataSet.slice();
        const columnIndex = img.column;

        const column = dataSet[columnIndex];

        if (column) {
            // Append to existing "row"/"column"
            if (!column.find((x: ItemColumn) => x.uri === img.uri)) {
                const newImages = [...column, img];
                dataCopy[columnIndex] = newImages;
            }
        } else {
            // Pass it as a new "row" for the data source
            dataCopy[columnIndex] = [img]
        }

        return dataCopy;
    };

    const _onLayoutChange = useCallback(({ nativeEvent: { layout: { height, width } } }: LayoutChangeEvent) => {
        setDimensions({ height, width })
    }, [])

    const _onHandleEndReach = () => {
        if (typeof onEndReach === 'function') {
            onEndReach()
        }
    }
    const _renderItem = ({ item, index }: { item: ItemColumn[]; index: number }) => {
        return (
            <Column  {...{ onPress, space, customImageComponent, customImageProps, renderFooter, renderHeader, dimensions, columns }} data={item} />
        )
    }
    const _keyExtractor = useCallback((item: ItemColumn[], index) => index.toString(), [])

    // effect
    useEffect(() => {
        if (Array.isArray(data)) {
            _formatData();
        }
    }, [data, columns])
    useEffect(() => {
        console.log('dataSource', dataSource)
    }, [dataSource])
    return (
        <View onLayout={_onLayoutChange} style={[styles.container]}>
            <FlatList
                data={dataSource}
                renderItem={_renderItem}
                keyExtractor={_keyExtractor}
                contentContainerStyle={[styles.content]}
                removeClippedSubviews={true}
                onEndReached={_onHandleEndReach}
                onEndReachedThreshold={16} />
        </View>
    )
}

export const Masonry = memo(MasonryComponent, isEqual)

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        width: '100%'
    }
})
