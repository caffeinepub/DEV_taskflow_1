import List "mo:core/List";
import Types "../types/projects";
import Common "../types/common";

module {
  public func listProjects(projects : List.List<Types.Project>) : [Types.Project] {
    projects.toArray();
  };

  public func getProject(projects : List.List<Types.Project>, id : Common.ProjectId) : ?Types.Project {
    projects.find(func(p) { p.id == id });
  };

  public func createProject(
    projects : List.List<Types.Project>,
    id : Common.ProjectId,
    name : Text,
    description : Text,
    order : Nat,
    createdAt : Common.Timestamp,
  ) : Types.Project {
    let project : Types.Project = { id; name; description; order; createdAt };
    projects.add(project);
    project;
  };

  public func updateProject(
    projects : List.List<Types.Project>,
    id : Common.ProjectId,
    name : Text,
    description : Text,
    order : Nat,
  ) : ?Types.Project {
    var updated : ?Types.Project = null;
    projects.mapInPlace(func(p) {
      if (p.id == id) {
        let next = { p with name; description; order };
        updated := ?next;
        next;
      } else { p };
    });
    updated;
  };

  public func deleteProject(projects : List.List<Types.Project>, id : Common.ProjectId) {
    let kept = projects.filter(func(p) { p.id != id });
    projects.clear();
    projects.append(kept);
  };

  public func replaceAll(projects : List.List<Types.Project>, incoming : [Types.Project]) {
    projects.clear();
    for (p in incoming.values()) {
      projects.add(p);
    };
  };
};
