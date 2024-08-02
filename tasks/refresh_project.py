import subprocess

print(subprocess.run(["bash /home/cdsw/tasks/scripts/refresh_project.sh"], shell=True, check=True))

print("Project refresh complete. Restart the API service Application to pick up changes.")
