<script lang="ts">
	import { Graphics, Rectangle, SpineProvider, SpineTrack } from 'pixi-svelte';
	import { FadeContainer } from 'components-pixi';
	import { SECOND } from 'constants-shared/time';

	import { getContext } from '../game/context';
	import { USE_PLACEHOLDER_ART, PLACEHOLDER_PALETTE } from '../game/constants';

	const context = getContext();
	const backgroundProps = $derived(
		context.stateLayoutDerived.normalBackgroundLayout({ scale: 0.5 }),
	);
	const showBaseBackground = $derived(context.stateGame.gameType === 'basegame');
	const showFeatureBackground = $derived(context.stateGame.gameType === 'freegame');
	const canvasSizes = $derived(context.stateLayoutDerived.canvasSizes());

	const drawBackground = (graphics, colors: { top: number; bottom: number }) => {
		graphics.clear();
		const steps = 24;
		const bandHeight = canvasSizes.height / steps;
		for (let i = 0; i < steps; i += 1) {
			const ratio = i / (steps - 1);
			const color = mixColor(colors.top, colors.bottom, ratio);
			graphics.rect(0, i * bandHeight, canvasSizes.width, bandHeight + 1).fill({ color });
		}
	};

	const mixColor = (from: number, to: number, ratio: number) => {
		const r = Math.round((((from >> 16) & 0xff) * (1 - ratio)) + (((to >> 16) & 0xff) * ratio));
		const g = Math.round((((from >> 8) & 0xff) * (1 - ratio)) + (((to >> 8) & 0xff) * ratio));
		const b = Math.round(((from & 0xff) * (1 - ratio)) + ((to & 0xff) * ratio));
		return (r << 16) | (g << 8) | b;
	};
</script>

<Rectangle {...canvasSizes} backgroundColor={0x000000} zIndex={-3} />

{#if USE_PLACEHOLDER_ART}
	<FadeContainer show={showBaseBackground} duration={SECOND} zIndex={-2}>
		<Graphics
			draw={(g) =>
				drawBackground(g, {
					top: PLACEHOLDER_PALETTE.baseBackgroundTop,
					bottom: PLACEHOLDER_PALETTE.baseBackgroundBottom,
				})}
		/>
		<Graphics
			draw={(g) => {
				// soft cloud band
				g.ellipse(canvasSizes.width * 0.2, canvasSizes.height * 0.82, canvasSizes.width * 0.3, canvasSizes.height * 0.12).fill({ color: 0xffffff, alpha: 0.45 });
				g.ellipse(canvasSizes.width * 0.65, canvasSizes.height * 0.9, canvasSizes.width * 0.35, canvasSizes.height * 0.14).fill({ color: 0xffffff, alpha: 0.35 });
				g.ellipse(canvasSizes.width * 0.95, canvasSizes.height * 0.78, canvasSizes.width * 0.25, canvasSizes.height * 0.1).fill({ color: 0xffffff, alpha: 0.3 });
			}}
		/>
	</FadeContainer>

	<FadeContainer show={showFeatureBackground} duration={SECOND} zIndex={-1}>
		<Graphics
			draw={(g) =>
				drawBackground(g, {
					top: PLACEHOLDER_PALETTE.featureBackgroundTop,
					bottom: PLACEHOLDER_PALETTE.featureBackgroundBottom,
				})}
		/>
	</FadeContainer>
{:else}
	<FadeContainer show={showBaseBackground} duration={SECOND} zIndex={-2}>
		<SpineProvider key="foregroundAnimation" {...backgroundProps}>
			<SpineTrack trackIndex={0} animationName="idle" loop />
		</SpineProvider>
		<SpineProvider key="foregroundAnimation" {...backgroundProps}>
			<SpineTrack trackIndex={0} animationName="dust" loop />
		</SpineProvider>
	</FadeContainer>

	<FadeContainer show={showFeatureBackground} duration={SECOND} zIndex={-1}>
		<SpineProvider key="foregroundFeatureAnimation" {...backgroundProps}>
			<SpineTrack trackIndex={0} animationName="idle" loop />
		</SpineProvider>
		<SpineProvider key="foregroundFeatureAnimation" {...backgroundProps}>
			<SpineTrack trackIndex={0} animationName="dust" loop />
		</SpineProvider>
	</FadeContainer>
{/if}
