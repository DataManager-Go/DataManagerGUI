package actions

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strconv"
	"strings"
	"time"

	"github.com/JojiiOfficial/gaw"
	"github.com/JojiiOfficial/shred"
)

// GetTempFile returns tempfile from fileName
func GetTempFile(fileName string) string {
	return filepath.Join(os.TempDir(), fmt.Sprintf("%s-%s", gaw.RandString(10), fileName))
}

// ShredderFile shreddres a file
func ShredderFile(localFile string, size int64) {
	shredder := shred.Shredder{}

	var shredConfig *shred.ShredderConf
	if size < 0 {
		s, err := os.Stat(localFile)
		if err != nil {
			fmt.Println("File to shredder not found")
			return
		}
		size = s.Size()
	}

	if size >= 1000000000 {
		// Size >= 1GB
		shredConfig = shred.NewShredderConf(&shredder, shred.WriteZeros, 1, true)
	} else if size >= 1000000000 {
		// Size >= 1GB
		shredConfig = shred.NewShredderConf(&shredder, shred.WriteZeros|shred.WriteRandSecure, 2, true)
	} else if size >= 5000 {
		// Size > 5kb
		shredConfig = shred.NewShredderConf(&shredder, shred.WriteZeros|shred.WriteRandSecure, 3, true)
	} else {
		// Size < 5kb
		shredConfig = shred.NewShredderConf(&shredder, shred.WriteZeros|shred.WriteRandSecure, 6, true)
	}

	// Shredder & Delete local file
	err := shredConfig.ShredFile(localFile)
	if err != nil {
		fmt.Println(err)
		// Delete file if shredder didn't
		err = os.Remove(localFile)
		if err != nil {
			fmt.Println(err)
		}
	}
}

// ShowFile opens a locally stored file
func ShowFile(filepath string) bool {
	// Windows
	if runtime.GOOS == "windows" {
		fmt.Println("Filepath: " + filepath)
		cmd := exec.Command("cmd", "/C "+filepath)
		output, _ := cmd.Output()
		time.Sleep(time.Second * 2) // why dfuck does this even work

		if len(output) > 0 {
			return false
		}

		// Great hack by Yukaru
		time.Sleep(2 * time.Second)
		// Linux
	} else if runtime.GOOS == "linux" {
		cmd := exec.Command("xdg-open", filepath)
		cmd.Stdout = os.Stdout
		cmd.Stderr = os.Stderr

		start := time.Now().Unix()

		if err := cmd.Run(); err != nil {
			fmt.Println("Error: ", err)
			return false
		}

		if time.Now().Unix()-start <= 2 {
			// Wait
			fmt.Println("Application exited too fast. Trying to wait for its PID to exit")

			// Get all PIDs in current terminal
			pids, err := getTerminalPIDs()
			if err != nil {
				fmt.Println(err)
				return false
			}

			// Only wait for programs launched AFTER xdg-open
			for _, pid := range pids {
				if pid >= cmd.Process.Pid {
					waitForPID(pid)
				}
			}
		}

	}

	return true
}

// Get all PIDs in current terminal
func getTerminalPIDs() ([]int, error) {
	var nums []int

	// Get current terminals processes
	out, err := exec.Command("sh", "-c", "ps --no-headers | grep -vE 'sh$' | grep -vE 'ps|grep' | cut -d ' ' -f2").Output()
	if err != nil {
		return nil, err
	}

	// Go for each line
	for _, snum := range strings.Split(string(out), "\n") {
		num, err := strconv.Atoi(snum)
		if err == nil {
			nums = append(nums, num)
		}
	}

	return nums, nil
}

func waitForPID(pid int) {
	if err := exec.Command("tail", fmt.Sprintf("--pid=%d", pid), "-f", "/dev/null").Run(); err != nil {
		fmt.Println(err)
	}
}
