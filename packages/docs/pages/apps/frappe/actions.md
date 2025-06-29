---
favicon: /favicons/frappe.svg
items:
  - name: Create Document 
    desc: Create a new document with the given data.
  - name: Get Document
    desc: Read an entire document with all the fields and child tables.
  - name: Update Document
    desc: Update an existing document.
  - name: Delete Document
    desc: Delete a given document from the system.
  - name: Get Document List
    desc: Get a list of documents of a given DocType with ability to set fields, filters, and limit.
---

<script setup>
  import CustomListing from '../../components/CustomListing.vue'
</script>

<CustomListing />
