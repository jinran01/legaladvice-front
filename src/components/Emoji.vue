<template>
  <div v-show="chooseEmoji" class="emoji-wrapper">

    <span
        class="emoji-item"
        v-for="(value, key, index) of emojiList"
        :key="index"
        @click="addEmoji(key)"
    >
        <v-img
            :lazy-src="value"
            :src="value"
            :title="key"
            class="emoji"
            width="24"
            height="24"
        />
    </span>
  </div>
</template>

<script>
import EmojiList from "../assets/js/emoji";
import {onMounted, ref} from "vue";

export default {
  props: {
    chooseEmoji: {
      type: Boolean
    }
  },
  setup(props, context) {
    let emojiList = ref({})
    const addEmoji = (key) => {
      context.emit("addEmoji", key)
    }
    onMounted(()=>{
      setTimeout(()=>{
        emojiList.value = EmojiList
      },2000)
    })
    return {
      emojiList,
      addEmoji,
    }
  },
};
</script>

<style scoped>
.emoji {
  user-select: none;
  margin: 0.25rem;
  display: inline-block;
  vertical-align: middle;
}

.emoji-item {
  cursor: pointer;
  display: inline-block;
}

.emoji-item:hover {
  transition: all 0.2s;
  border-radius: 0.25rem;
  background: #dddddd;
}

.emoji-wrapper {
  max-height: 150px;
  overflow-y: auto;
}
</style>
