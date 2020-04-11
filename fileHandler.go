package main

import (
	"fmt"
	"os"
	"path/filepath"
)

var (
	baseFilepath = fmt.Sprintf(os.Getenv("HOME"), filepath.Separator, "Documents", filepath.Separator, "DataManager")
)

/*
// AssetDir returns the file names below a certain
// directory embedded in the file by go-bindata.
// For example if you run go-bindata on data/... and data contains the
// following hierarchy:
//     data/
//       foo.txt
//       img/
//         a.png
//         b.png
// then AssetDir("data") would return []string{"foo.txt", "img"}
// AssetDir("data/img") would return []string{"a.png", "b.png"}
// AssetDir("foo.txt") and AssetDir("notexist") would return an error
// AssetDir("") will return []string{"data"}.
func AssetDir(name string) ([]string, error) {

	fmt.Println("\n\n\nAssetDir called. baseFilepath: " + baseFilepath + "\n\n\n")

	files, err := ioutil.ReadDir("./")
	var fileNames []string

	if err != nil {
		return nil, err
	}

	for _, f := range files {
		fileNames = append(fileNames, f.Name())
	}

	return fileNames, nil
}

// Asset loads and returns the assset for the given name
func Asset(name string) ([]byte, error) {

	fmt.Println("Asset called. Reading from " + (baseFilepath + name))

	data, err := ioutil.ReadFile(baseFilepath + name)

	if err != nil {
		return nil, err
	}

	return data, nil
}
*/
