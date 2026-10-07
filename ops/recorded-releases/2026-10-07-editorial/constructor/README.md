# Constructor editorial overlay

Changed files only, not a standalone service. Apply to a separately copied and verified constructor-v2-release-nLeCS8/api baseline. Preserve its complete public/vendor assets, external state and signing-key. The separate widget/layout.html is served by Nginx; public/index.html belongs to the API public directory. Do not place state, credentials or orders in Git. Runtime backup and rollback paths are documented in PROJECT_OVERVIEW.md.
