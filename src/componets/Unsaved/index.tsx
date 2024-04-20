import  { useCallback, useEffect } from "react";
import { BlockerFunction, useBlocker } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import userSelectors from "../../redux/user/userSelectors";
import { setShowUnsaved } from "../../redux/user/userSlice";

export default function Unsaved() {
    const dispatch = useDispatch();
    const showUnsaved = useSelector(userSelectors.getShowUnsaved);

    const shouldBlock = useCallback<BlockerFunction>(
        ({ currentLocation, nextLocation }) =>
            showUnsaved  && currentLocation.pathname !== nextLocation.pathname,
        [showUnsaved]
    );

    const blocker = useBlocker(shouldBlock);

    useEffect(() => {
        if (showUnsaved && blocker.state === "blocked") {
            const confirmUnsavedChanges = window.confirm(
                "You have unsaved changes. Do you want to leave the page?"
            );
            if (confirmUnsavedChanges) {
                handleConfirm();
            } else {
                handleCancel();
            }
        }
    }, [showUnsaved, blocker.state]);

    const handleConfirm = () => {
        dispatch(setShowUnsaved(false));
        blocker.proceed?.();
    };

    const handleCancel = () => {
        blocker.reset?.();
    };

    return null;
}
