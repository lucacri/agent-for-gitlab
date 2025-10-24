## [1.3.0](https://github.com/lucacri/agent-for-gitlab/compare/v1.2.16...v1.3.0) (2025-10-24)


### Features

* add CLAUDE_CODE_OAUTH_TOKEN as primary auth method ([3bb6f15](https://github.com/lucacri/agent-for-gitlab/commit/3bb6f152123762ce042f92025c04cc5d1987ac1c))

## [1.2.16](https://github.com/lucacri/agent-for-gitlab/compare/v1.2.15...v1.2.16) (2025-10-24)


### Bug Fixes

* add ca-certificates package for SSL verification ([06c8dce](https://github.com/lucacri/agent-for-gitlab/commit/06c8dce586f56eee84859f44b4ca8ce0a7215aa2))

## [1.2.15](https://github.com/lucacri/agent-for-gitlab/compare/v1.2.14...v1.2.15) (2025-10-24)

## [1.2.14](https://github.com/lucacri/agent-for-gitlab/compare/v1.2.13...v1.2.14) (2025-10-24)


### Bug Fixes

* configure Git to trust mounted repo directories ([fffa4a0](https://github.com/lucacri/agent-for-gitlab/commit/fffa4a04fda845344824ec76d5f3e40564ec59bb))

## [1.2.13](https://github.com/lucacri/agent-for-gitlab/compare/v1.2.12...v1.2.13) (2025-10-24)


### Bug Fixes

* handle empty prompts with default message ([5e47019](https://github.com/lucacri/agent-for-gitlab/commit/5e4701946b602fdde5fae87ffbb118d93041b959))

## [1.2.12](https://github.com/lucacri/agent-for-gitlab/compare/v1.2.11...v1.2.12) (2025-10-24)


### Bug Fixes

* remove hardcoded cwd that doesn't exist in GitLab CI ([062a897](https://github.com/lucacri/agent-for-gitlab/commit/062a897de279b121ed2737638e770ff58ab9c98a))

## [1.2.11](https://github.com/lucacri/agent-for-gitlab/compare/v1.2.10...v1.2.11) (2025-10-24)


### Bug Fixes

* execute Claude CLI with node explicitly to bypass shebang issue ([8609dd0](https://github.com/lucacri/agent-for-gitlab/commit/8609dd00a65055ae11ae4c9b5a9f6421162fdfaa))

## [1.2.10](https://github.com/lucacri/agent-for-gitlab/compare/v1.2.9...v1.2.10) (2025-10-24)


### Bug Fixes

* use full path for Claude CLI execution and add version tracking ([1f61c79](https://github.com/lucacri/agent-for-gitlab/commit/1f61c791c2dcd3a460abd68775fde85301dadf46))

## [1.2.9](https://github.com/lucacri/agent-for-gitlab/compare/v1.2.8...v1.2.9) (2025-10-24)


### Bug Fixes

* add IS_SANDBOX=1 environment variable for Claude Code CLI in Docker ([1b09b31](https://github.com/lucacri/agent-for-gitlab/commit/1b09b31e99f760909f937287eb13a05056a0a1b6))

## [1.2.8](https://github.com/lucacri/agent-for-gitlab/compare/v1.2.7...v1.2.8) (2025-10-24)


### Bug Fixes

* use PATH resolution for claude binary instead of hardcoded path ([f7dc791](https://github.com/lucacri/agent-for-gitlab/commit/f7dc7910046c86a0162c9aed2993918e45dbdc04))

## [1.2.7](https://github.com/lucacri/agent-for-gitlab/compare/v1.2.6...v1.2.7) (2025-10-24)


### Bug Fixes

* execute /usr/bin/claude directly instead of via node ([68e680a](https://github.com/lucacri/agent-for-gitlab/commit/68e680a10650b2fd9ac5d5561517896af7b2c698))

## [1.2.6](https://github.com/lucacri/agent-for-gitlab/compare/v1.2.5...v1.2.6) (2025-10-24)


### Bug Fixes

* execute Claude CLI directly via Node.js instead of symlink ([f83df1b](https://github.com/lucacri/agent-for-gitlab/commit/f83df1b13b9af0d52fb377e0d42aba668283fe85))

## [1.2.5](https://github.com/lucacri/agent-for-gitlab/compare/v1.2.4...v1.2.5) (2025-10-24)


### Bug Fixes

* add shell option to claude CLI spawn for symlink resolution ([e142c01](https://github.com/lucacri/agent-for-gitlab/commit/e142c019602789bc48abf1fcf440ede5c98778c0))

## [1.2.4](https://github.com/lucacri/agent-for-gitlab/compare/v1.2.3...v1.2.4) (2025-10-24)


### Bug Fixes

* correct Docker mount syntax for .claude.json file ([16adaca](https://github.com/lucacri/agent-for-gitlab/commit/16adaca0e527308d9b2a820d75a81b6ed4589ec7))

## [1.2.3](https://github.com/lucacri/agent-for-gitlab/compare/v1.2.2...v1.2.3) (2025-10-24)


### Bug Fixes

* add verification for Claude CLI installation ([d450f4f](https://github.com/lucacri/agent-for-gitlab/commit/d450f4f3b89b1cc1216f56831925728d1d2a7441))

## [1.2.2](https://github.com/lucacri/agent-for-gitlab/compare/v1.2.1...v1.2.2) (2025-10-24)


### Bug Fixes

* migrate GitHub workflows from GHCR to Docker Hub ([093b9f7](https://github.com/lucacri/agent-for-gitlab/commit/093b9f74f2acb419c8bf3e1f9314083decab0263))

## [1.2.1](https://github.com/lucacri/agent-for-gitlab/compare/v1.2.0...v1.2.1) (2025-10-24)


### Bug Fixes

* update Docker image names in GitHub workflows ([6983582](https://github.com/lucacri/agent-for-gitlab/commit/69835828f1e8cb6b108e2297ab8a3a60afe59e7f))

## [1.2.0](https://github.com/lucacri/agent-for-gitlab/compare/v1.1.1...v1.2.0) (2025-10-23)


### Features

* add optional Claude configuration mounting to agent-image ([485b4b4](https://github.com/lucacri/agent-for-gitlab/commit/485b4b46a19ddbdb5c7361e19ac407af53503eb7))

## [1.1.1](https://github.com/lucacri/agent-for-gitlab/compare/v1.1.0...v1.1.1) (2025-10-23)

## [1.1.0](https://github.com/lucacri/agent-for-gitlab/compare/v1.0.0...v1.1.0) (2025-10-21)


### Features

* add GitHub Actions for automated Docker builds and semantic releases ([ca2ed8a](https://github.com/lucacri/agent-for-gitlab/commit/ca2ed8a0d454a34202cf04c9dd6d989ea40c22fb))

## 1.0.0 (2025-10-21)


### Features

* add `sticky_comment` input to reduce GitHub comment spam ([#211](https://github.com/lucacri/agent-for-gitlab/issues/211)) ([7d3d217](https://github.com/lucacri/agent-for-gitlab/commit/7d3d217367fe751ad44f0010b2b8f0a495617ace))
* add base_branch input to specify source branch for new Claude branches ([#72](https://github.com/lucacri/agent-for-gitlab/issues/72)) ([e769593](https://github.com/lucacri/agent-for-gitlab/commit/e769593b6ddfa8fae3a87507ed1dd1a5194e6797)), closes [#62](https://github.com/lucacri/agent-for-gitlab/issues/62)
* Add centralized temp directory handling for GitHub and GitLab ([4194788](https://github.com/lucacri/agent-for-gitlab/commit/4194788aaedf6359e08c7551317c5bbda990b23a))
* Add CLAUDE_CODE_GL_ACCESS_TOKEN and CC_SKIP_PRE_CHECK support ([5538324](https://github.com/lucacri/agent-for-gitlab/commit/55383246a9a0af555f2145aa42014455907c3cff))
* add claude_env input for custom environment variables ([#102](https://github.com/lucacri/agent-for-gitlab/issues/102)) ([ab22512](https://github.com/lucacri/agent-for-gitlab/commit/ab2251246960a0bf7ace0afda7f06ffab43c513f))
* Add complete Claude Code execution to GitLab CI ([d3e6402](https://github.com/lucacri/agent-for-gitlab/commit/d3e6402b2051f091cb72ed515deea3937ab698c9))
* Add comprehensive logging for GitLab authentication debugging ([a7a4905](https://github.com/lucacri/agent-for-gitlab/commit/a7a49057f5924264239db76d2b4a207453015b1d))
* add DETAILED_PERMISSION_MESSAGES env var to Claude Code invocation ([#328](https://github.com/lucacri/agent-for-gitlab/issues/328)) ([5310abb](https://github.com/lucacri/agent-for-gitlab/commit/5310abb8f503f1a7a0322257d139cfbda2047e0e))
* Add Discord notifications and fix GitLab webhook payload ([5507edd](https://github.com/lucacri/agent-for-gitlab/commit/5507edd78f16a17919db41cc5b6c8508141cf96f))
* add fallback_model input to enable automatic model fallback ([#228](https://github.com/lucacri/agent-for-gitlab/issues/228)) ([2706c8e](https://github.com/lucacri/agent-for-gitlab/commit/2706c8ed6f0849050943c22f0614e1e13f056eac))
* add formatted output for Claude Code execution reports ([#18](https://github.com/lucacri/agent-for-gitlab/issues/18)) ([912b3b5](https://github.com/lucacri/agent-for-gitlab/commit/912b3b5f8994cdc8fc3f72633dfe069eea734deb))
* Add full issue support to GitLab provider ([c0f913e](https://github.com/lucacri/agent-for-gitlab/commit/c0f913e8dbeba501f4d43e56a1108cfdab481537))
* add GitHub Actions for automated Docker builds and semantic releases ([c0cfa14](https://github.com/lucacri/agent-for-gitlab/commit/c0cfa14ae5ee971d4b97587516c36730b85ed223))
* Add GitHub Actions workflow for GitLab app Docker builds ([08fe82c](https://github.com/lucacri/agent-for-gitlab/commit/08fe82c3babb766c7ce127889da31e4b710236f3))
* Add GitLab CI pipeline integration for Claude ([dbbeef2](https://github.com/lucacri/agent-for-gitlab/commit/dbbeef2235a5c4a6c8d161ad528bb03a44618d41))
* Add GitLab merge request creation and response posting ([5175a16](https://github.com/lucacri/agent-for-gitlab/commit/5175a1672f359941a8387bacbf3c459632d4b688))
* Add GitLab MR creation, fix webhook branch handling, emphasize GitLab-only nature ([1fe2992](https://github.com/lucacri/agent-for-gitlab/commit/1fe2992c9f96777da5da3980152f017e243a9d45))
* Add issue branch creation and structured logging ([c166d92](https://github.com/lucacri/agent-for-gitlab/commit/c166d9263e2721619eb1563516a9a590f086383b))
* add max_turns parameter support ([#149](https://github.com/lucacri/agent-for-gitlab/issues/149)) ([4adf56d](https://github.com/lucacri/agent-for-gitlab/commit/4adf56d341c41b04e61507b95fab2a116f34ef68)), closes [#148](https://github.com/lucacri/agent-for-gitlab/issues/148)
* add mcp_config input that merges with existing mcp server ([#96](https://github.com/lucacri/agent-for-gitlab/issues/96)) ([c770a04](https://github.com/lucacri/agent-for-gitlab/commit/c770a042c01a57d1f8bb6fcdf7b5186d5c69b14c))
* add MultiEdit to base_allowed_tools ([#155](https://github.com/lucacri/agent-for-gitlab/issues/155)) ([a737909](https://github.com/lucacri/agent-for-gitlab/commit/a73790983d596b34548cc1473dddad074d9fb180))
* add OAuth token authentication support ([#236](https://github.com/lucacri/agent-for-gitlab/issues/236)) ([37d8d98](https://github.com/lucacri/agent-for-gitlab/commit/37d8d98eb6a5fbea892cd599b010a5633b0ddc35))
* add release workflow with beta tag management ([#171](https://github.com/lucacri/agent-for-gitlab/issues/171)) ([5f05936](https://github.com/lucacri/agent-for-gitlab/commit/5f059366a6b83051677dd17d9fef2be432b448c0))
* add roadmap for Claude Code GitHub Action v1.0 ([#150](https://github.com/lucacri/agent-for-gitlab/issues/150)) ([ffde4e6](https://github.com/lucacri/agent-for-gitlab/commit/ffde4e60717f7cc74f2e5faa7e84a847a3318afe))
* add settings input support ([#276](https://github.com/lucacri/agent-for-gitlab/issues/276)) ([3bfb4b1](https://github.com/lucacri/agent-for-gitlab/commit/3bfb4b129799a63ff0cc33e2fee2e72d7b970700))
* Add unified GitLab entrypoint for simplified CI workflow ([94c9ec0](https://github.com/lucacri/agent-for-gitlab/commit/94c9ec0f6ca98f1dca329b1672a7a485b9a3c263))
* add unified update_claude_comment tool ([#98](https://github.com/lucacri/agent-for-gitlab/issues/98)) ([f24d359](https://github.com/lucacri/agent-for-gitlab/commit/f24d359e3a38faab2f8e2c18afe83435b67704cc))
* add use_commit_signing input with default false ([#238](https://github.com/lucacri/agent-for-gitlab/issues/238)) ([da88bd1](https://github.com/lucacri/agent-for-gitlab/commit/da88bd1cabefdbfcc78d8aaf71216f200fa5f2a0))
* add workflow to sync base-action to claude-code-base-action repo ([#299](https://github.com/lucacri/agent-for-gitlab/issues/299)) ([fdb186f](https://github.com/lucacri/agent-for-gitlab/commit/fdb186f1ab16aa98b5e768513da073e44a93ccd9))
* allow user override of hardcoded disallowed tools ([#71](https://github.com/lucacri/agent-for-gitlab/issues/71)) ([6f82de5](https://github.com/lucacri/agent-for-gitlab/commit/6f82de592fcce6faee3ea91538991df6f3823231)), closes [#49](https://github.com/lucacri/agent-for-gitlab/issues/49)
* clarify direct prompt instructions in create-prompt ([#324](https://github.com/lucacri/agent-for-gitlab/issues/324)) ([996647a](https://github.com/lucacri/agent-for-gitlab/commit/996647a04d716f52cc2113d83f43cc026c48fcf9))
* **claude:** initial revert to claude code ([2f980c0](https://github.com/lucacri/agent-for-gitlab/commit/2f980c0bf01d31ab1a4fd3c5d22bcd383a0c1301))
* Complete GitLab OAuth app with Claude integration ([39ea15f](https://github.com/lucacri/agent-for-gitlab/commit/39ea15f7f9c8634d3b1926da34ad8459661264a4))
* Complete React + Express modernization ([99893cf](https://github.com/lucacri/agent-for-gitlab/commit/99893cf32271490a0a5b03025506f57c2ecc51e1))
* **config:** add branch prefix configuration ([#197](https://github.com/lucacri/agent-for-gitlab/issues/197)) ([91c16fa](https://github.com/lucacri/agent-for-gitlab/commit/91c16fa585a86385ee53c92c6b5bda68df7f1470))
* defer remote branch creation until first commit ([#244](https://github.com/lucacri/agent-for-gitlab/issues/244)) ([f0d3828](https://github.com/lucacri/agent-for-gitlab/commit/f0d38284f2daf917e4282e8589180f513bcb9999))
* display detailed error messages when prepare step fails ([#82](https://github.com/lucacri/agent-for-gitlab/issues/82)) ([3724cba](https://github.com/lucacri/agent-for-gitlab/commit/3724cba8e7b2f11db4b55d5353b0b149c775eec1))
* enhance error reporting with specific error types from Claude execution ([#164](https://github.com/lucacri/agent-for-gitlab/issues/164)) ([b39b020](https://github.com/lucacri/agent-for-gitlab/commit/b39b0200cdab6a09fcef4483e0f47841cdd676e2)), closes [#163](https://github.com/lucacri/agent-for-gitlab/issues/163)
* format PR and issue body text in prompt variables ([#330](https://github.com/lucacri/agent-for-gitlab/issues/330)) ([8dbf7a2](https://github.com/lucacri/agent-for-gitlab/commit/8dbf7a26988afc39cbb2b7a058260a7d193cc743))
* forward NODE_VERSION environment variable to base action ([#230](https://github.com/lucacri/agent-for-gitlab/issues/230)) ([190d206](https://github.com/lucacri/agent-for-gitlab/commit/190d2060c40af1e1ab7fddc91585b9894c50f14e)), closes [#229](https://github.com/lucacri/agent-for-gitlab/issues/229)
* Improve pipeline trigger error handling with detailed logging ([ac53a3e](https://github.com/lucacri/agent-for-gitlab/commit/ac53a3ee3f7cbd4013b8e8b264ce8fc3ddc12a65))
* integrate Claude Code SDK to replace process spawning ([#327](https://github.com/lucacri/agent-for-gitlab/issues/327)) ([6aa3309](https://github.com/lucacri/agent-for-gitlab/commit/6aa3309e21eef7ec5c221f2e07cdea9d410ec14a))
* integrate claude-code-base-action as local subaction ([#285](https://github.com/lucacri/agent-for-gitlab/issues/285)) ([bfe5618](https://github.com/lucacri/agent-for-gitlab/commit/bfe5618caa575d90a02e5a5cd21df4595637dc37))
* rename anthropic_model input to model with backward compatibility ([2b9011b](https://github.com/lucacri/agent-for-gitlab/commit/2b9011b2aa6a9b2c331c9662713fb969009b2760))
* strip HTML comments from GitHub content ([cca3160](https://github.com/lucacri/agent-for-gitlab/commit/cca3160e107eff7c5d93b7df4020cf327b6a0627))
* update sync workflow to use MIRROR_DISCLAIMER.md file ([#300](https://github.com/lucacri/agent-for-gitlab/issues/300)) ([fa48bb6](https://github.com/lucacri/agent-for-gitlab/commit/fa48bb6c3c8397bb32ed81b362e0edcaf05e0a23))
* Update webhook-triggered.gitlab-ci.yml with advanced examples and fix tests ([b39cb0e](https://github.com/lucacri/agent-for-gitlab/commit/b39cb0e1430e1ebdf9a34f2b3f4c7e9bc1b70d2b))
* use Bun as package manager in webhook-service Dockerfile ([4137959](https://github.com/lucacri/agent-for-gitlab/commit/41379592080f981284400c4e6e3b95db9c7d0a3d))
* use dynamic fetch depth based on PR commit count ([#169](https://github.com/lucacri/agent-for-gitlab/issues/169)) ([f55bcc4](https://github.com/lucacri/agent-for-gitlab/commit/f55bcc409e33a1829c5b38ba39b27ec741c05c0b))
* use GitHub display name in Co-authored-by trailers ([#163](https://github.com/lucacri/agent-for-gitlab/issues/163)) ([b3b3044](https://github.com/lucacri/agent-for-gitlab/commit/b3b30441a60862503bedef7b54408d2a9b87c99e))


### Bug Fixes

* add baseUrl to Octokit initialization in update_claude_comment ([#157](https://github.com/lucacri/agent-for-gitlab/issues/157)) ([3dfc568](https://github.com/lucacri/agent-for-gitlab/commit/3dfc568ade5de8d3f3bac32b5d35346c367fc2cf)), closes [#156](https://github.com/lucacri/agent-for-gitlab/issues/156) [#107](https://github.com/lucacri/agent-for-gitlab/issues/107)
* add Bedrock base URL fallback to match base-action configuration ([#304](https://github.com/lucacri/agent-for-gitlab/issues/304)) ([26e917c](https://github.com/lucacri/agent-for-gitlab/commit/26e917c00dbdaa99cef9bbe5c350867667a6bdc6))
* add GITHUB_API_URL to all Octokit client instantiations ([#243](https://github.com/lucacri/agent-for-gitlab/issues/243)) ([f4959ca](https://github.com/lucacri/agent-for-gitlab/commit/f4959caadae708e482e2778c4108bbb203564e2a))
* Add missing GitLab webhook module and fix TypeScript errors ([4147fbb](https://github.com/lucacri/agent-for-gitlab/commit/4147fbb99d7e3ca1002655589fd6eb9551cb99c0))
* add missing LABEL_TRIGGER environment variable to prepare step ([#209](https://github.com/lucacri/agent-for-gitlab/issues/209)) ([13f5606](https://github.com/lucacri/agent-for-gitlab/commit/13f5606811e81a2e8e143381ae68098b02fe190c))
* add model parameter support to base-action ([#307](https://github.com/lucacri/agent-for-gitlab/issues/307)) ([162f465](https://github.com/lucacri/agent-for-gitlab/commit/162f465a1f440c3de4b6a18342f9340d033fb65e))
* allow direct_prompt with issue assignment without requiring assignee_trigger ([#192](https://github.com/lucacri/agent-for-gitlab/issues/192)) ([d876527](https://github.com/lucacri/agent-for-gitlab/commit/d8765271bd60536056b81453c43b979a26767497)), closes [#113](https://github.com/lucacri/agent-for-gitlab/issues/113)
* Apply prettier formatting to pass CI checks ([42e806e](https://github.com/lucacri/agent-for-gitlab/commit/42e806e4587cc80160dee4b56201fbd1ebf10d5c))
* checkout base branch before creating new branches ([#311](https://github.com/lucacri/agent-for-gitlab/issues/311)) ([8a08425](https://github.com/lucacri/agent-for-gitlab/commit/8a084251d5174c73837b2dc4ea1a3d8c57c24539)), closes [#268](https://github.com/lucacri/agent-for-gitlab/issues/268)
* Clean up temp files and properly pass comment ID between processes ([a0f0ac7](https://github.com/lucacri/agent-for-gitlab/commit/a0f0ac718e865c619e2ed2ff5696b2efd6d43dd8))
* conditionally show Bash limitation based on commit signing setting ([#310](https://github.com/lucacri/agent-for-gitlab/issues/310)) ([e58a1f0](https://github.com/lucacri/agent-for-gitlab/commit/e58a1f06b5024b3d43cc72abc12c50c790c781cc))
* correct assignee trigger test to handle different assignee properly ([#178](https://github.com/lucacri/agent-for-gitlab/issues/178)) ([53a5bd2](https://github.com/lucacri/agent-for-gitlab/commit/53a5bd29cddfc011f057be5cc0c75f18e84908cc)), closes [#2](https://github.com/lucacri/agent-for-gitlab/issues/2)
* Correct GitLab API method calls and fix authentication issues ([6dc962c](https://github.com/lucacri/agent-for-gitlab/commit/6dc962c841d8f7aa6a169ac1e396b30e6d550598))
* Correct mcp_config_file parameter to mcp_config in issue-triage workflow ([#89](https://github.com/lucacri/agent-for-gitlab/issues/89)) ([5936df8](https://github.com/lucacri/agent-for-gitlab/commit/5936df846e8db0b53eb1ccb97cc3c306ceac87c5))
* Ensure GitLab comments are posted after Claude execution ([1d08da4](https://github.com/lucacri/agent-for-gitlab/commit/1d08da443775ffb616714b9674e85a3fe7b1257d))
* Fix GitLab pipeline trigger API variable format ([b1b6f25](https://github.com/lucacri/agent-for-gitlab/commit/b1b6f252d7529e2d44852d2f2234ea1da86a5ac0))
* Fix TypeScript compilation errors ([6a32f2c](https://github.com/lucacri/agent-for-gitlab/commit/6a32f2c47c448c72f04c224a51d34ec0f7743821))
* git checkout disambiguate error ([#306](https://github.com/lucacri/agent-for-gitlab/issues/306)) ([ae47f9b](https://github.com/lucacri/agent-for-gitlab/commit/ae47f9bb7b876be202b9b04d8417b88f5978b9a9))
* **github:** fixing claude login user name ([#227](https://github.com/lucacri/agent-for-gitlab/issues/227)) ([de83ea7](https://github.com/lucacri/agent-for-gitlab/commit/de83ea78c49f1e31e3e80b88fd4ffb4f1fedc0db))
* Handle unexpanded GitLab environment variables and improve token debugging ([4b53879](https://github.com/lucacri/agent-for-gitlab/commit/4b53879e92067b3f89e18671be6f4803081da0a9))
* Improve GitLab prompt generation and add issue context support ([81ae5e7](https://github.com/lucacri/agent-for-gitlab/commit/81ae5e75b22a6b5f0c4ddc7fa1eac76aa55da015))
* Improve pipeline trigger implementation ([ad120e4](https://github.com/lucacri/agent-for-gitlab/commit/ad120e4e8c097feb49c1a3a4830bc3a188098157))
* only load GitHub MCP server when its tools are allowed ([#124](https://github.com/lucacri/agent-for-gitlab/issues/124)) ([bd933ac](https://github.com/lucacri/agent-for-gitlab/commit/bd933acea8da16ca1e5f9157836253d9f930b710))
* Pass correct branch names to MCP file ops server ([#279](https://github.com/lucacri/agent-for-gitlab/issues/279)) ([f599ccf](https://github.com/lucacri/agent-for-gitlab/commit/f599ccfebf572e29a9fde866958a652c559a27e3)), closes [#244](https://github.com/lucacri/agent-for-gitlab/issues/244) [#278](https://github.com/lucacri/agent-for-gitlab/issues/278)
* prevent command injection in git hash-object call ([#297](https://github.com/lucacri/agent-for-gitlab/issues/297)) ([0814c9b](https://github.com/lucacri/agent-for-gitlab/commit/0814c9b36330db891a9f657041f7ad92ed5064a0))
* Remove Docker Hub and use only GitHub Container Registry ([8190cfe](https://github.com/lucacri/agent-for-gitlab/commit/8190cfe48f05e8c0842763c7a90a05f9a4bc1acf))
* Remove GitHub Actions core.* usage from GitLab mode ([a268bae](https://github.com/lucacri/agent-for-gitlab/commit/a268baeae1ce45b68a793668a33b901ac6ba562d))
* Remove newlines from GitLab merge request description ([648cc14](https://github.com/lucacri/agent-for-gitlab/commit/648cc1441f5fd082823699866f5fdbe712ffb4fc))
* Remove security scan from GitLab app workflow ([44f91b1](https://github.com/lucacri/agent-for-gitlab/commit/44f91b1d52c341cebb0ee50cb6d524d344753878))
* Rename Dockerfile.simple to Dockerfile for GitHub Actions workflow ([c92aa9f](https://github.com/lucacri/agent-for-gitlab/commit/c92aa9fbe14a2d7e68032078dea82fee6547a282))
* replace github.action_path with GITHUB_ACTION_PATH for containerized workflows ([#133](https://github.com/lucacri/agent-for-gitlab/issues/133)) ([dbc6e8d](https://github.com/lucacri/agent-for-gitlab/commit/dbc6e8d763913fd42297c15faacd2e5590d22639)), closes [#132](https://github.com/lucacri/agent-for-gitlab/issues/132)
* resolve CI issues - formatting and TypeScript errors ([#217](https://github.com/lucacri/agent-for-gitlab/issues/217)) ([38834aa](https://github.com/lucacri/agent-for-gitlab/commit/38834aade8050873a0c551754a216acdfa005c29))
* Resolve TypeScript errors in GitLab provider ([34c90a2](https://github.com/lucacri/agent-for-gitlab/commit/34c90a23eb821279f084831e2be5b7807b124ef5))
* run Claude from workflow directory instead of base-action directory ([#312](https://github.com/lucacri/agent-for-gitlab/issues/312)) ([d3bc61c](https://github.com/lucacri/agent-for-gitlab/commit/d3bc61c5d31cb1b2bce97bb3e9e45dd49ab2d6e7))
* set disallowed_tools as env when runing prepare.ts ([#151](https://github.com/lucacri/agent-for-gitlab/issues/151)) ([a217b99](https://github.com/lucacri/agent-for-gitlab/commit/a217b99dcd025b48e418e63a86d9457200c1e663))
* skip SHA computation for deleted files ([#115](https://github.com/lucacri/agent-for-gitlab/issues/115)) ([b4f9de6](https://github.com/lucacri/agent-for-gitlab/commit/b4f9de6171c6499c4a193fde4278d56dfbb74f18))
* specify baseUrl in Octokit ([#107](https://github.com/lucacri/agent-for-gitlab/issues/107)) ([#108](https://github.com/lucacri/agent-for-gitlab/issues/108)) ([f524b47](https://github.com/lucacri/agent-for-gitlab/commit/f524b47e01deb54089d0b8c9230746f32b6aba4d))
* Update condition for final message in output ([#106](https://github.com/lucacri/agent-for-gitlab/issues/106)) ([275c4be](https://github.com/lucacri/agent-for-gitlab/commit/275c4be63d356334c6d7716aef42650b6c7a00a8))
* Update GitHub Actions workflow for fork compatibility ([28d63bc](https://github.com/lucacri/agent-for-gitlab/commit/28d63bc3fe7a81be667077a2efc86d24f64baf1a))
* update MCP server image to version 0.6.0 ([#234](https://github.com/lucacri/agent-for-gitlab/issues/234)) ([5e6aec9](https://github.com/lucacri/agent-for-gitlab/commit/5e6aec99342374dee8231ef8f44caff1cf1fc03d))
* Update tests for enhanced GitLab provider debugging ([811dbc5](https://github.com/lucacri/agent-for-gitlab/commit/811dbc572a5985f444cf9347bb5822d86837e11a))
* Update webhook-triggered CI to use proper runner script ([fc93439](https://github.com/lucacri/agent-for-gitlab/commit/fc93439099edf194e828af2f39b51cb587d3fbd1))
* Update webhook-triggered GitLab CI to use rules syntax ([4e8f465](https://github.com/lucacri/agent-for-gitlab/commit/4e8f46527e5adcad747bf69c603a826c0b4bedef))
* Use CLAUDE_CODE_GL_ACCESS_TOKEN for git push authentication ([9e84d57](https://github.com/lucacri/agent-for-gitlab/commit/9e84d5777f413eca7156cc4c73c75d9495f04f42))
* Use file-based communication instead of GitHub-specific ::set-output ([1f1197c](https://github.com/lucacri/agent-for-gitlab/commit/1f1197cbfd0d9bcfd23dd4909dc266949a9a0861))
* use GITHUB_SERVER_URL to determine email domain for GitHub Enterprise ([#290](https://github.com/lucacri/agent-for-gitlab/issues/290)) ([f5c8e76](https://github.com/lucacri/agent-for-gitlab/commit/f5c8e76651f6fee4b94bbfbc9633b1f8951e69f2)), closes [#288](https://github.com/lucacri/agent-for-gitlab/issues/288)
* wrap github MCP config with mcpServers in issue-triage workflow ([#118](https://github.com/lucacri/agent-for-gitlab/issues/118)) ([655e145](https://github.com/lucacri/agent-for-gitlab/commit/655e14587ede4d14319b5cf79e0f098dfd47d2e1))


### Performance Improvements

* optimize Squid proxy startup time ([#334](https://github.com/lucacri/agent-for-gitlab/issues/334)) ([5cdcb53](https://github.com/lucacri/agent-for-gitlab/commit/5cdcb53e3194f10871c2b438e7e30abf8eae9ee6))


### Reverts

* Revert "feat: integrate Claude Code SDK to replace process spawning (#327)" (#335) ([d3cc491](https://github.com/lucacri/agent-for-gitlab/commit/d3cc491706cf5f041acb96b4eaea81f7b35a5bea)), closes [#327](https://github.com/lucacri/agent-for-gitlab/issues/327) [#335](https://github.com/lucacri/agent-for-gitlab/issues/335) [#327](https://github.com/lucacri/agent-for-gitlab/issues/327)
* Revert "feat: defer remote branch creation until first commit (#244)" (#278) ([cf0c12d](https://github.com/lucacri/agent-for-gitlab/commit/cf0c12dbdbd9f1ce3f5cd7895eabb890f13ce4b9)), closes [#244](https://github.com/lucacri/agent-for-gitlab/issues/244) [#278](https://github.com/lucacri/agent-for-gitlab/issues/278)
* Revert "feat: enhance error reporting with specific error types from Claude e…" (#179) ([489af99](https://github.com/lucacri/agent-for-gitlab/commit/489af993c3136573aac93c29ca3a383dcf9e75b9)), closes [#179](https://github.com/lucacri/agent-for-gitlab/issues/179)
