import List "mo:core/List";
import Time "mo:core/Time";
import ProjectTypes "../types/projects";
import Common "../types/common";
import TaskTypes "../types/tasks";
import ProjectLib "../lib/projects";
import TaskLib "../lib/tasks";

mixin (
  projects : List.List<ProjectTypes.Project>,
  tasks : List.List<TaskTypes.Task>,
  nextId : { var count : Nat },
) {
  public query func getProjects() : async [ProjectTypes.Project] {
    ProjectLib.listProjects(projects);
  };

  public func createProject(
    name : Text,
    description : Text,
    order : Nat,
  ) : async ProjectTypes.Project {
    nextId.count += 1;
    let id = "p-" # nextId.count.toText();
    ProjectLib.createProject(projects, id, name, description, order, Time.now());
  };

  public func updateProject(
    id : Common.ProjectId,
    name : Text,
    description : Text,
    order : Nat,
  ) : async ?ProjectTypes.Project {
    ProjectLib.updateProject(projects, id, name, description, order);
  };

  public func deleteProject(id : Common.ProjectId) : async () {
    ProjectLib.deleteProject(projects, id);
    TaskLib.deleteByProject(tasks, id);
  };
};
