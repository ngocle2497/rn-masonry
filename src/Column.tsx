import React, { memo, useState, useEffect, useMemo, useCallback } from 'react'
import { View, StyleProp, ViewStyle, FlatList } from 'react-native'
import isEqual from 'react-fast-compare'
import { ColumnsProps, Dimensions, CellProps } from './types'
import { Cell } from './Cell'
import { DEFAULT_COLUMNS, DEFAULT_CELL_SPACE } from './constants'

const ColumnComponent = ({ data, dimensions, containerImageStyle, customRenderItem, columns, space = DEFAULT_CELL_SPACE, customImageComponent, customImageProps, renderFooter, renderHeader }: ColumnsProps) => {
    const [columnWidth, setColumnWidth] = useState(0)
    const [dataSource, setDataSource] = useState<Array<CellProps>>([])

    const _resizeImage = () => {
        return data.map((image: any) => {
            const imageForColumn = _resizeByColumns(image.dimensions, dimensions, columns)
            return { ...image, ...imageForColumn }
        })
    }

    const _resizeByColumns = useCallback((imgDimensions: Dimensions, listDimensions: Dimensions, nColumns = DEFAULT_COLUMNS) => {
        const { width } = listDimensions;
        const _columnWidth = (width / nColumns) - space / 2;

        if (_columnWidth !== columnWidth) {
            setColumnWidth(_columnWidth)
        }
        const divider = imgDimensions.width / columnWidth;

        const newWidth = imgDimensions.width / divider;
        const newHeight = imgDimensions.height / divider;

        return { width: newWidth, height: newHeight };
    }, [columnWidth])

    const _keyExtractor = useCallback((item: CellProps) => ("IMAGE_" + item.uri), []);

    const _renderItem = ({ item }: { item: CellProps; index: number; }) => {
        const { height, width, uri, data, column, dimensions } = item;
        const propsBase = { uri, width, height, data, column, actualSize: dimensions }
        return !customRenderItem ? (
            <Cell {...propsBase} {...{ containerImageStyle,space, dimensions, customImageComponent, customImageProps, renderFooter, renderHeader }} />
        ) : customRenderItem(propsBase)
    }

    const containerStyle = useMemo(() => [{ width: columnWidth, overflow: 'hidden' }] as StyleProp<ViewStyle>, [columnWidth])

    useEffect(() => {
        const images = _resizeImage()
        setDataSource(images)
    }, [data, dimensions, columns, columnWidth])

    return (
        <View style={containerStyle}>
            <FlatList
                data={dataSource}
                scrollEnabled={false}
                renderItem={_renderItem}
                keyExtractor={_keyExtractor}
                bounces={false}
                overScrollMode={'never'}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false} />
        </View>
    )
}

export const Column = memo(ColumnComponent, isEqual)