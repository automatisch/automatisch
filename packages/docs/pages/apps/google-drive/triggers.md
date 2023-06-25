---
favicon: /favicons/google-drive.svg
items:
  - name: New files
    desc: Triggers when any new file is added (inside of any folder).
  - name: New files in folder
    desc: Triggers when a new file is added directly to a specified folder (but not its subfolder).
  - name: New folders
    desc: Triggers when a new folder is added directly to a specified folder (but not its subfolder).
  - name: Updated files
    desc: Triggers when a file is updated in a specified folder (but not its subfolder).
---

<script setup>
  import CustomListing from '../../components/CustomListing.vue'
</script>

<CustomListing />
