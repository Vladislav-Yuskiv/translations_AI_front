import {IRootState} from "../../types/interfaces";

const getKeysValues = (state:IRootState) => state.bundlesKeysValues.keysValues;

const getKeysValuesLoading = (state:IRootState) => state.bundlesKeysValues.keysValuesLoading;

const getKeyValueProcessing = (state:IRootState) => state.bundlesKeysValues.keyValueProcessing;

const valuesSelectors = {
    getKeysValues,
    getKeysValuesLoading,
    getKeyValueProcessing,
};

export default valuesSelectors;