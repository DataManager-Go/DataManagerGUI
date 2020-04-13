package main

import "fmt"

// DownloadFiles will download the files given inside the array
func DownloadFiles(fileIDs []uint64, path string) {
	for _, id := range fileIDs {
		_, err := manager.NewFileRequestByID(uint(id)).DownloadToFile(path, 0600)
		if err != nil {
			fmt.Println(err)
			continue
		}
	}
}
