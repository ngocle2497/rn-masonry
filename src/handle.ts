
import { Data, ObjectColumn, ObjectIndex } from './types';

export const assignObjectColumn = (nColumns: number, index: number, targetObject: Data): ObjectColumn => ({ ...targetObject, ...{ column: index % nColumns } });

export const assignObjectIndex = (index: number, targetObject: ObjectColumn): ObjectIndex => ({ ...targetObject, ...{ index } });
