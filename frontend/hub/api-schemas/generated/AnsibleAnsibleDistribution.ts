// Autogenerated file. Please do not modify.

// If you want to modify fields to interface, create new one in the folder above and create interface with the same name.
// You can then add, modify or even delete existing interface fields. Delete is done with Omit, note however it returns new interface.
// Those autogenerated interfaces does not contains all types, some of them are unknown - those are candidates for custom modification.
// See readme in folder above for more information.

/* eslint-disable @typescript-eslint/no-empty-interface */

// Serializer for Ansible Distributions.
export interface AnsibleAnsibleDistribution {
  // The base (relative) path component of the published url. Avoid paths that                     overlap with other distribution base paths (e.g. "foo" and "foo/bar")
  base_path: string;
  // An optional content-guard.
  content_guard: string;
  // A unique name. Ex, `rawhide` and `stable`.
  name: string;
  // The latest RepositoryVersion for this Repository will be served.
  repository: string;
  // RepositoryVersion to be served
  repository_version: string;
  pulp_labels: unknown;
}