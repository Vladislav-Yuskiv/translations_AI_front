import {IRootState} from "../../types/interfaces";

const getAvailable = (state:IRootState) => state.bundles.availableBundles;

const getUpdateBundleLoading = (state:IRootState) => state.bundles.updateBundleLoading;

const getCurrentBundle = (state:IRootState) => state.bundles.currentBundle;

const getLoading = (state:IRootState) => state.bundles.loading;

const getDeleteLoading = (state:IRootState) => state.bundles.deleteLoading;

const getBundleUsersLoading = (state:IRootState) => state.bundles.bundleUsersLoading;

const getCurrentBundleUsers = (state:IRootState) => state.bundles.currentBundleUsers;

const getModalCreate = (state:IRootState) => state.bundles.modalCreate;

const getCreatingLoading = (state:IRootState) => state.bundles.creatingLoading;

const getBundleAlert = (state:IRootState) => state.bundles.isWarningAlert;

const bundlesSelectors = {
    getAvailable,
    getLoading,
    getCurrentBundle,
    getUpdateBundleLoading,
    getDeleteLoading,
    getBundleUsersLoading,
    getCurrentBundleUsers,
    getModalCreate,
    getCreatingLoading,
    getBundleAlert
};

export default bundlesSelectors;