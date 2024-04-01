/* eslint-disable simple-header/header */

import { NavContextMenuPatchCallback } from "@api/ContextMenu";
import definePlugin from "@utils/types";
import { Menu } from "@webpack/common";

const patchMessageContextMenu: NavContextMenuPatchCallback = (
    children,
    props,
) => {
    const { message } = props;
    children.push(
        <Menu.MenuItem
            id="reverse-message"
            key="reverse-message"
            label="Reverse Message"
            action={() => {
                message.content = message.content.split("").reverse().join("");
            }}
        />,
    );
};

export default definePlugin({
    name: "Reverse",
    description: "Reverses messages",
    authors: [
        {
            id: 12345n,
            name: "ToastedToast",
        },
    ],
    contextMenus: {
        message: patchMessageContextMenu,
    },
    patches: [],
    // Delete these two below if you are only using code patches
    start() {
        console.log("running");
    },
    stop() {},
});
