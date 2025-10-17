---
favicon: /favicons/facebook.svg
items:
  - name: Create Post
    desc: Create a new post on a Facebook page you manage.
---

<script setup>
  import CustomListing from '../../components/CustomListing.vue'
</script>

<CustomListing />

## Create Post

This action allows you to create a new post on a Facebook page that you manage. You can create text posts, posts with links, or both.

### Parameters

| Parameter       | Description                                                                                                     |
| --------------- | --------------------------------------------------------------------------------------------------------------- |
| Page            | Select the Facebook page where you want to publish the post. Only pages you have admin access to will be shown. |
| Message         | The text content of your post. This can include any text, emojis, or hashtags.                                  |
| Link (Optional) | A URL to include with your post. The link must include the protocol (http:// or https://).                      |
| Published       | Whether to publish the post immediately (true) or save as a draft (false). Default is true.                     |

### Notes

- You must have a Facebook connection with the appropriate page permissions (`pages_manage_posts`).
- For links to preview correctly, they must be valid URLs with a proper protocol (http:// or https://).
- The Facebook page must be one that you have administrative access to.
- Posts will be published as the page (not your personal account).

### Example Output

```json
{
  "data": {
    "id": "123456789_987654321"
  },
  "success": true,
  "postId": "123456789_987654321"
}
```

The `postId` can be used to reference the post later, or to construct a URL to the post.
