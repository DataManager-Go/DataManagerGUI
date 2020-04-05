package jsprotocol

// NamespaceGroupsList shows all namespaces and their groups
type NamespaceGroupsList struct {
	User    string     `json:"user"`
	Content [][]string `json:"content"`
}
