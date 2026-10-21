---
name: GitHub secret push protection
description: Credential findings can remain in unpublished commits even after the current file is clean.
---

GitHub push protection scans the full history being pushed, not only the final working tree. Removing a credential from the current file or a later commit is insufficient.

**Why:** An earlier local commit can still trigger a push block after the final tree is clean.

**How to apply:** If a credential was committed, revoke it and scrub or recreate every affected unpublished commit before pushing. Do not use the push-protection bypass URL.
