package main

import "fmt"

// DownloadFiles will download the files given inside the array
func DownloadFiles(fileIDs []uint64, path string) {
	for _, id := range fileIDs {
		err := manager.DownloadFile("", uint(id), "", path, true)
		if err != nil {
			fmt.Println(err)
		} else {
			fmt.Println("Downloaded a file into", path)
		}
	}
}
