/* eslint-disable simple-header/header */

import { ChatBarButton, addChatBarButton } from "@api/ChatButtons";
import { NavContextMenuPatchCallback } from "@api/ContextMenu";
import definePlugin from "@utils/types";
import { ChannelStore, Menu } from "@webpack/common";
import { settings } from "./settings";
import { addPreSendListener, removePreSendListener } from "@api/MessageEvents";
import { addButton } from "@api/MessagePopover";

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
        addButton("vc-reverse-message", (message) => {
            if (!message.content) return null;

            return {
                label: "Reverse Message",
                icon: () => (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <path d="M9 14 4 9l5-5" />
                        <path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11" />
                    </svg>
                ),
                message,
                channel: ChannelStore.getChannel(message.channel_id),
                onClick: () => {
                    message.content = reverseMessage(message.content);
                },
            };
        });
        console.log("If you're reading this, the Reverse plugin loaded");
    },
    stop() {
        removePreSendListener(this.preSend);
    },
});
