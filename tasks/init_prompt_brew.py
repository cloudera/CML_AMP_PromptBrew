import subprocess

print(subprocess.run(["bash /home/cdsw/tasks/scripts/run_python.sh"], shell=True, check=True))

print("Application installed and should be running shortly")
