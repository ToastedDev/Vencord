/* eslint-disable simple-header/header */

import { definePluginSettings } from "@api/Settings";
import { OptionType } from "@utils/types";

export const settings = definePluginSettings({
    autoReverse: {
        type: OptionType.BOOLEAN,
        description: "Automatically reverse every message you send.",
        default: false,
    },
});
