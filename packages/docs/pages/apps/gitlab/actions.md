---
favicon: /favicons/gitlab.svg
items:
  - name: 'Issue: Create a new project Issue'
    desc: Creates a new project issue.
  - name: 'Issue: Delete a project Issue'
    desc: Deletes an issue. Only for administrators and project owners.
  - name: 'Issue: Get single project Issue'
    desc: Get a single project issue.
  - name: 'Issue: List/find project Issues'
    desc: List or find project issues.
  - name: 'Issue: Update a project Issue'
    desc: Updates an existing project issue. This request is also used to close or reopen an issue (with state_event).
  - name: 'Issue: Create a new Issue Relation'
    desc: Creates a two-way relation between two issues. The user must be allowed to update both issues to succeed.
  - name: 'Issue: Delete an Issue Relation'
    desc: Deletes an issue link, thus removes the two-way relationship.
  - name: 'Issue: List Issue Relations'
    desc: Get a list of a given issue's linked issues, sorted by the relationship creation datetime (ascending). Issues are filtered according to the user authorizations.
  - name: 'Issue: Create a new Issue Note'
    desc: Creates a new note to a single project issue.
  - name: 'Issue: Delete an Issue Note'
    desc: Deletes an existing note of an issue.
  - name: 'Issue: Get a single Issue Note'
    desc: Returns a single note for a specific project issue.
  - name: 'Issue: List Issue Notes'
    desc: Gets a list of all notes for a single issue.
  - name: 'Issue: Update an Issue Note'
    desc: Modify existing note of an issue.
  - name: 'Merge Request: Create a new Merge Request Note'
    desc: Creates a new note for a single merge request. Notes are not attached to specific lines in a merge request.
  - name: 'Merge Request: Delete a Merge Request Note'
    desc: Deletes an existing note of a merge request.
  - name: 'Merge Request: Get a single Merge Request Note'
    desc: Returns a single note for a given merge request.
  - name: 'Merge Request: List Merge Request Notes'
    desc: Gets a list of all notes for a single merge request.
  - name: 'Merge Request: Modify a Merge Request Note'
    desc: Modify an existing note of a merge request.
  - name: 'Snippet: Create a new Snippet Note'
    desc: Creates a new note for a single snippet.
  - name: 'Snippet: Delete a Snippet Note'
    desc: Deletes an existing note of a snippet.
  - name: 'Snippet: Get a single Snippet Note'
    desc: Returns a single note for a given snippet.
  - name: 'Snippet: List Snippet Notes'
    desc: Gets a list of all notes for a single snippet.
  - name: 'Snippet: Modify a Snippet Note'
    desc: Modifies an existing note of a snippet.

---

<script setup>
  import CustomListing from '../../components/CustomListing.vue'
</script>

<CustomListing />
