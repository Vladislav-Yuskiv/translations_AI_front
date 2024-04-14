import {IRootState} from "../../types/interfaces";

const getUserName = (state:IRootState) => state.session.user.name;

const getCollapsed = (state:IRootState) => state.session.isCollapsed;

const getUserEmail = (state:IRootState) => state.session.user.email;

const getLoginStatus = (state:IRootState) => state.session.isLoggedIn;

const getUserIsLoading = (state:IRootState) => state.session.loading;

const userSelectors = {
    getUserName,
    getUserEmail,
    getLoginStatus,
    getUserIsLoading,
    getCollapsed
};

export default userSelectors;
