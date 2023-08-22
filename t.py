import subprocess

# Communicate with a process interactively
process = subprocess.Popen(['pleco'], stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)

# Send input to the process
process.stdin.write('uci\n')
process.stdin.flush()

# Wait for the process to finish and get the output
output, error = process.communicate()

# Print the output
print(output)

# Terminate the process
process.terminate()

