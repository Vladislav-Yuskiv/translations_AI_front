import {IRootState} from "../../types/interfaces";

const getUserName = (state:IRootState) => state.session.user.name;

const getUserId = (state:IRootState) => state.session.user.id;

const getCollapsed = (state:IRootState) => state.session.isCollapsed;

const getShowUnsaved = (state:IRootState) => state.session.showUnsaved;

const getUserEmail = (state:IRootState) => state.session.user.email;

const getLoginStatus = (state:IRootState) => state.session.isLoggedIn;

const getUserIsLoading = (state:IRootState) => state.session.loading;

const getRefreshLoading = (state:IRootState) => state.session.refreshLoading;

const getLoginLoading = (state:IRootState) => state.session.loginLoading;


const userSelectors = {
    getUserName,
    getUserEmail,
    getLoginStatus,
    getUserIsLoading,
    getCollapsed,
    getRefreshLoading,
    getUserId,
    getLoginLoading,
    getShowUnsaved
};

export default userSelectors;
