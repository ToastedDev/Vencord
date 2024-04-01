/* eslint-disable simple-header/header */

import { ChatBarButton, addChatBarButton } from "@api/ChatButtons";
import { NavContextMenuPatchCallback } from "@api/ContextMenu";
import definePlugin from "@utils/types";
import { Menu } from "@webpack/common";
import { settings } from "./settings";
import { addPreSendListener, removePreSendListener } from "@api/MessageEvents";

const reverseMessage = (content: string) =>
    content.split("").reverse().join("");

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
                message.content = reverseMessage(message.content);
            }}
        />,
    );
};

export default definePlugin({
    name: "Reverse",
    description: "Reverses messages",
    settings,
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
        this.preSend = addPreSendListener(async (_, message) => {
            if (!settings.store.autoReverse) return;
            if (!message.content) return;

            message.content = reverseMessage(message.content);
        });
        console.log("If you're reading this, the Reverse plugin loaded");
    },
    stop() {
        removePreSendListener(this.preSend);
    },
});
