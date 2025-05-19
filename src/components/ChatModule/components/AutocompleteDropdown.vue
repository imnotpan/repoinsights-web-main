
<template>
  <transition name="fade">
    <ul
      v-if="show"
      ref="listRef"
      :class="[
        'max-h-48 absolute Z-[99999] bg-white border shadow-lg overflow-auto rounded-md'
      ]"
    :style="dropdownStyle">    
      <li
        v-for="item in props.items"
        :key="item.id"
        @click="select(item)"
        class="px-2 py-1 hover:bg-gray-100 cursor-pointer flex flex-col"
      >
        <slot name="item" :item="item" />
      </li>
      <li v-if="props.items.length == 0" class="px-2 py-1 text-gray-500">
        No hay resultados
      </li>
    </ul>
  </transition>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch, computed, unref } from 'vue'

const props = defineProps({
  show:        { type: Boolean, default: false },
  editorRef:   { type: [Object, Function], required: true },
  items:       { type: Array,   default: () => [] },
  widthPx:     { type: [Number, String], default: 256 },
  position:    { type: Object, default: () => ({ x: 0, y: 0 })},

})
const emit = defineEmits(['select', 'update:show'])
const listRef = ref(null)
const dropdownWidth = computed(() =>
  typeof props.widthPx === 'number'
    ? props.widthPx
    : parseInt(props.widthPx)
)

const dropdownStyle = computed(() => {
  const editorEl    = unref(props.editorRef)
  const editorRect  = editorEl.getBoundingClientRect()
  const { x, bottom } = props.position
  const viewportWidth = window.innerWidth || document.documentElement.clientWidth
  const dropdownLeft = editorRect.left + x
  const offset = 210
  const spaceRight = (viewportWidth - offset) - (dropdownLeft + dropdownWidth.value)
  const spaceLeft  = dropdownLeft - offset


  if (spaceRight < 0 && spaceLeft >= dropdownWidth.value ) {
    return {
      position: 'absolute',
      left:   `${x - dropdownWidth.value}px`,
      bottom: `${bottom}px`,
      width:  `${dropdownWidth.value}px`
    }
  }

  if (spaceRight < 0 && spaceLeft < dropdownWidth.value + offset ) {
    return {
      position: 'absolute',
      right:  `8px`,              
      bottom: `${bottom}px`,
      width:  `${dropdownWidth.value}px`
    }
  }

  return {
    position: 'absolute',
    left:    `${x}px`,
    bottom:  `${bottom}px`,
    width:   `${dropdownWidth.value}px`
  }
})

function select(item) {
  emit('select', item)
}




</script>