/* eslint-disable simple-header/header */

import "./styles.css";

import {
    addChatBarButton,
    ChatBarButton,
    removeChatBarButton,
} from "@api/ChatButtons";
import { NavContextMenuPatchCallback } from "@api/ContextMenu";
import { addPreSendListener, removePreSendListener } from "@api/MessageEvents";
import { addButton, removeButton } from "@api/MessagePopover";
import { classNameFactory } from "@api/Styles";
import definePlugin from "@utils/types";
import { ChannelStore, Menu } from "@webpack/common";

import { settings } from "./settings";

const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
function generateId() {
    let id = "";
    for (var i = 0; i < 12; i++) {
        id += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return id;
}

const rawReverseMessage = (content: string) =>
    content.split("").reverse().join("");

function reverseMessage(content: string) {
    const emojis: { id: string; emoji: string }[] = [];
    return content
        .replace(
            new RegExp(
                "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$",
                "u",
            ),
            (str) => {
                const id = generateId();
                emojis.push({
                    id,
                    emoji: str,
                });
                return `placeholder-${id}`;
            },
        )
        .split("")
        .reverse()
        .join("")
        .replace(/>[0-9]*@</g, rawReverseMessage)
        .replace(new RegExp(`[${characters}]*-redlohecalp`, "gu"), (str) => {
            console.log(str);
            const id = rawReverseMessage(str).replace("placeholder-", "");
            const emoji = emojis.find((emoji) => emoji.id === id);
            if (emoji) return emoji.emoji;
            else return str;
        });
}

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

function ReverseIcon({ className }: { className: string }) {
    return (
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
            className={className}
        >
            <path d="M9 14 4 9l5-5" />
            <path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11" />
        </svg>
    );
}

export const cl = classNameFactory("vc-reverse-");

const ReverseChatBarIcon: ChatBarButton = ({ isMainChat }) => {
    const { autoReverse } = settings.use(["autoReverse"]);

    if (!isMainChat) return null;

    const toggle = () => {
        const newState = !autoReverse;
        settings.store.autoReverse = newState;
    };

    return (
        <ChatBarButton
            tooltip="Toggle Reverse Message"
            onClick={() => toggle()}
            buttonProps={{
                "aria-haspopup": "dialog",
            }}
        >
            <ReverseIcon className={cl({ "auto-reverse": autoReverse })} />
        </ChatBarButton>
    );
};

export default definePlugin({
    name: "Reverse",
    description: "Reverses messages",
    settings,
    authors: [
        {
            name: "ToastedToast",
            id: 955408387905048637n,
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
        addChatBarButton("vc-reverse", ReverseChatBarIcon);
        addButton("vc-reverse-message", (message) => {
            if (!message.content) return null;

            return {
                label: "Reverse Message",
                icon: ReverseIcon,
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
        removeChatBarButton("vc-reverse");
        removeButton("vc-reverse-message");
    },
});
