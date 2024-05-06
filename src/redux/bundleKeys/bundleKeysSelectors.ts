import {IRootState} from "../../types/interfaces";

const getKeysLoading = (state:IRootState) => state.keys.keysLoading;

const getAllKeys= (state:IRootState) => state.keys.keys;

const getKeysInfo= (state:IRootState) => state.keys.keysInfo;
const getKeysInfoLoading = (state:IRootState) => state.keys.keysInfoLoading;
const getPagination= (state:IRootState) => state.keys.pagination;
const getProcessKeyLoading = (state:IRootState) => state.keys.processKeyLoading;
const getKeysUploading = (state:IRootState) => state.keys.uploading;

const keysSelectors = {
    getKeysLoading,
    getProcessKeyLoading,
    getAllKeys,
    getKeysInfo,
    getPagination,
    getKeysInfoLoading,
    getKeysUploading
};

export default keysSelectors;
