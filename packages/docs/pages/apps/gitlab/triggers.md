---
favicon: /favicons/gitlab.svg
items:
  - name: Confidential issue event
    desc: Triggers when a new confidential issue is created or an existing issue is updated, closed, or reopened.
  - name: Confidential comment event
    desc: Triggers when a new confidential comment is made on commits, merge requests, issues, and code snippets.
  - name: Deployment event
    desc: Triggers when a deployment starts, succeeds, fails or is canceled.
  - name: Feature flag event
    desc: Triggers when a feature flag is turned on or off.
  - name: Issue event
    desc: Triggers when a new issue is created or an existing issue is updated, closed, or reopened.
  - name: Job event
    desc: Triggers when the status of a job changes.
  - name: Merge request event
    desc: Triggers when merge request is created, updated, or closed.
  - name: Comment event
    desc: Triggers when a new comment is made on commits, merge requests, issues, and code snippets.
  - name: Pipeline event
    desc: Triggers when the status of a pipeline changes.
  - name: Push event
    desc: Triggers when you push to the repository.
  - name: Release event
    desc: Triggers when a release is created or updated.
  - name: Tag event
    desc: Triggers when you create or delete tags in the repository.
  - name: Wiki page event
    desc: Triggers when a wiki page is created, updated, or deleted.
---

<script setup>
  import CustomListing from '../../components/CustomListing.vue'
</script>

<CustomListing />
