import List "mo:core/List";
import ProjectTypes "../types/projects";
import TaskTypes "../types/tasks";
import ProjectLib "../lib/projects";
import TaskLib "../lib/tasks";

mixin (
  projects : List.List<ProjectTypes.Project>,
  tasks : List.List<TaskTypes.Task>,
) {
  public type AppData = {
    projects : [ProjectTypes.Project];
    tasks : [TaskTypes.Task];
  };

  public query func getData() : async AppData {
    {
      projects = ProjectLib.listProjects(projects);
      tasks = TaskLib.listTasks(tasks);
    };
  };

  public func saveAll(
    incomingProjects : [ProjectTypes.Project],
    incomingTasks : [TaskTypes.Task],
  ) : async () {
    ProjectLib.replaceAll(projects, incomingProjects);
    TaskLib.replaceAll(tasks, incomingTasks);
  };
};
