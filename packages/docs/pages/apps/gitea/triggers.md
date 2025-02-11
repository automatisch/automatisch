---
favicon: /favicons/gitea.svg
items:
  - name: New issues
    desc: Triggers when a new issue is created.
  - name: New pull requests
    desc: Triggers when the user creates a new pull request.
  - name: New stargazers
    desc: Triggers when a user stars a repository.
  - name: New watchers
    desc: Triggers when a user watches a repository.
---

<script setup>
  import CustomListing from '../../components/CustomListing.vue'
</script>

<CustomListing />
