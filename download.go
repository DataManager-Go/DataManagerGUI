package main

import "fmt"

func downloadFiles(fileIDs []uint64, path string) {
	for _, id := range fileIDs {
		err := manager.DownloadFile("", uint(id), "", path, true)
		if err != nil {
			fmt.Println(err)
		}
	}
}
