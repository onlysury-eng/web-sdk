import UI from './src/components/UI.svelte';
import UiGameName from './src/components/UiGameName.svelte';

import messagesMap from './src/i18n/messagesMap';
import { i18nDerived } from './src/i18n/i18nDerived';

export * from './src/types';

export { setContextUiTheme, getContextUiTheme, DEFAULT_UI_THEME } from './src/theme';
export type { UiTheme } from './src/theme';

export { messagesMap, i18nDerived, UI, UiGameName };
