<template>
  <footer class="editor-status-bar">
    <div class="status-file" :title="pathname || filename">
      <span class="save-dot" :class="{ show: !isSaved }"></span>
      <span class="filename">{{ filename || 'Untitled' }}</span>
    </div>
    <div class="status-items">
      <span class="status-item">Row {{ currentRow || '-' }}</span>
      <span class="status-item">Words {{ wordCount.word }}</span>
      <span class="status-item">Characters {{ wordCount.character }}</span>
      <span class="status-item">Paragraphs {{ wordCount.paragraph }}</span>
      <span class="status-item">All {{ wordCount.all }}</span>
    </div>
  </footer>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      filename: state => state.editor.currentFile.filename,
      pathname: state => state.editor.currentFile.pathname,
      isSaved: state => state.editor.currentFile.isSaved,
      currentRow: state => state.editor.currentFile.currentRow,
      wordCount: state => state.editor.currentFile.wordCount || {
        paragraph: 0,
        word: 0,
        character: 0,
        all: 0
      }
    })
  }
}
</script>

<style scoped>
  .editor-status-bar {
    height: var(--statusBarHeight);
    min-height: var(--statusBarHeight);
    padding: 0 12px;
    border-top: 1px solid var(--editorColor10);
    box-sizing: border-box;
    background: var(--editorBgColor);
    color: var(--editorColor60);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    font-size: 12px;
    line-height: var(--statusBarHeight);
    user-select: none;
  }
  .status-file,
  .status-items {
    min-width: 0;
    display: flex;
    align-items: center;
  }
  .status-file {
    flex: 1;
  }
  .filename {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .save-dot {
    width: 7px;
    height: 7px;
    margin-right: 7px;
    border-radius: 50%;
    background: var(--highlightThemeColor);
    opacity: .75;
    visibility: hidden;
    flex: 0 0 auto;
  }
  .save-dot.show {
    visibility: visible;
  }
  .status-items {
    flex: 0 1 auto;
    justify-content: flex-end;
    gap: 14px;
    overflow: hidden;
  }
  .status-item {
    white-space: nowrap;
  }
</style>
