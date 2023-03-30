---
favicon: /favicons/google-drive.svg
items:
  - name: New Files
    desc: Triggers when any new file is added (inside of any folder)
  - name: New Files in Folder
    desc: Triggers when a new file is added directly to a specific folder (but not its subfolder)
  - name: New Folders
    desc: Triggers when a new folder is added directly to a specific folder (but not its subfolder)
---

<script setup>
  import CustomListing from '../../components/CustomListing.vue'
</script>

<CustomListing />
