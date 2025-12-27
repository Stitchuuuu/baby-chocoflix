<template>
	<teleport to="body">
		<transition name="fade">
			<div v-if="modelValue" class="mobile-selector__overlay" @click="close"></div>
		</transition>

		<transition name="slide-up">
			<div v-if="modelValue" class="mobile-selector__sheet">
				<div class="mobile-selector__handle"></div>

				<div class="mobile-selector__options">
					<component
						v-for="option in options"
						:key="option.value"
						:is="option.action === 'url' ? 'a' : 'button'"
						:href="option.action === 'url' ? option.value : null"
						:target="option.action === 'url' ? '_blank' : null"
						class="mobile-selector__option"
						@click="select(option)"
					>
						{{ option.label }}
					</component>
				</div>

				<button class="mobile-selector__cancel" @click="close">Annuler</button>
			</div>
		</transition>
	</Teleport>
</template>

<script setup>
defineProps({
	modelValue: Boolean,
	options: {
		type: Array,
		required: true
	}
})

const emit = defineEmits(['update:modelValue', 'select'])

function close() {
	emit('update:modelValue', false)
}

async function select(option) {
	if (option.action === 'copy') {
		const type = 'text/plain'
		const clipboardItemData = {
			[type]: option.value,
		}
		const clipboardItem = new ClipboardItem(clipboardItemData)
		await navigator.clipboard.write([clipboardItem])
	}
	emit('select', option)
	close()
}
</script>

<style>
/* === Variables (restent inchangées) === */
:root {
  --overlay-bg: rgba(0, 0, 0, 0.5);
  --sheet-bg: #ffffff;
  --sheet-text: #000000;
  --handle-bg: #ccc;
  --option-bg: #f3f3f3;
  --option-hover-bg: #e0e0e0;
  --cancel-bg: #e74c3c;
  --cancel-text: #ffffff;
  --sheet-shadow: 0 -8px 30px rgba(0,0,0,0.6);
}

@media (prefers-color-scheme: dark) {
  :root {
    --overlay-bg: rgba(0, 0, 0, 0.75);
    --sheet-bg: #121212;
    --sheet-text: #ffffff;
    --handle-bg: #333;
    --option-bg: #1f1f1f;
    --option-hover-bg: #2a2a2a;
    --cancel-bg: #2b2b2b;
    --cancel-text: #aaa;
    --sheet-shadow: 0 -10px 30px rgba(0,0,0,0.7);
  }
}
.mobile-selector__overlay {
  position: fixed;
  inset: 0;
  background: var(--overlay-bg);
  z-index: 1000;
}

.mobile-selector__sheet {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--sheet-bg);
  color: var(--sheet-text);
  border-radius: 16px 16px 0 0;
  padding: 12px;
  z-index: 1001;
  box-shadow: var(--sheet-shadow);
}

.mobile-selector__handle {
  width: 40px;
  height: 4px;
  background: var(--handle-bg);
  border-radius: 2px;
  margin: 8px auto 16px;
}

.mobile-selector__options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.mobile-selector__option {
  padding: 14px;
  border-radius: 10px;
  border: none;
  background: var(--option-bg);
  color: var(--sheet-text);
  font-size: 16px;
  transition: background 0.15s ease;
	text-decoration: none;
	text-align: center;
}

.mobile-selector__option:hover {
  background: var(--option-hover-bg);
}

.mobile-selector__cancel {
  margin-top: 12px;
  padding: 14px;
  width: 100%;
  border: none;
  background: var(--cancel-bg);
  color: var(--cancel-text);
  border-radius: 10px;
  font-size: 15px;
}

/* Transitions */
.fade-enter-active, .fade-leave-active {
	transition: opacity .25s ease;
}
.fade-enter-from, .fade-leave-to {
	opacity: 0;
}

.slide-up-enter-active, .slide-up-leave-active {
	transition: transform .3s ease;
}
.slide-up-enter-from, .slide-up-leave-to {
	transform: translateY(100%);
}
</style>
