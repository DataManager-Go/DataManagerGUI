package jsprotocol

// NamespaceGroupsList shows all namespaces and their groups
type NamespaceGroupsList struct {
	User    string     `json:"user"`
	Content [][]string `json:"content,omitempty"`
}

// TagList shows all namespaces and their groups
type TagList struct {
	User    string   `json:"user"`
	Content []string `json:"content,omitempty"`
}

// NamespaceGroupInfo contains all namespaces and groups
type NamespaceGroupInfo struct {
	Group     string `json:"group"`
	Namespace string `json:"namespace"`
}

// DownloadStruct contains the id's of files to download
type DownloadStruct struct {
	Files []uint `json:"files"`
}

// FileNamespaceStruct contains a file and a namespace (lol)
type FileNamespaceStruct struct {
	Namespace string `json:"namespace"`
	File      string `json:"file"`
}

// UploadFilesStruct contains info of files to upload
type UploadFilesStruct struct {
	Files    []string `json:"files"`
	Settings string   `json:"settings"`
}

// UploadDirectoryStruct contains info about files within a dir to upload
type UploadDirectoryStruct struct {
	Path     string `json:"dir"`
	Settings string `json:"settings"`
}

// UploadInfoSettings contains the settings of an upload request
type UploadInfoSettings struct {
	Namespace  string   `json:"namespace"`
	Tags       []string `json:"tags"`
	Groups     []string `json:"groups"`
	Encrypt    bool     `json:"encrypt"`
	MakePublic bool     `json:"public"`
	Compress   bool     `json:"compress"`
}

// CreateOrRenameInformation contains information on creating / renaming namespaces, groups and tags
type CreateOrRenameInformation struct {
	Target    string `json:"target"`
	Name      string `json:"name"`
	Namespace string `json:"namespace"`
	Group     string `json:"group"`
	Tag       string `json:"tag"`
	FileID    string `json:"file"`
}

// DeleteInformation is the equivalent of CreateOrRenameInformation for deletion
type DeleteInformation struct {
	Target    string `json:"target"`
	Namespace string `json:"namespace"`
	Group     string `json:"group"`
	Tag       string `json:"tag"`
	Files     []uint `json:"files"`
}
