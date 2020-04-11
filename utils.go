package main

import "strconv"

// Convert an string slice to an integer slice
func strToUIntslice(sl []string) ([]uint64, error) {
	iSl := make([]uint64, len(sl))
	for i := range sl {
		var err error
		iSl[i], err = strconv.ParseUint(sl[i], 10, 32)
		if err != nil {
			return nil, err
		}
	}

	return iSl, nil
}
