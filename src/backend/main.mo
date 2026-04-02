import List "mo:core/List";
import ProjectTypes "types/projects";
import TaskTypes "types/tasks";
import ProjectsApi "mixins/projects-api";
import TasksApi "mixins/tasks-api";
import SyncApi "mixins/sync-api";

actor {
  let projects = List.empty<ProjectTypes.Project>();
  let tasks = List.empty<TaskTypes.Task>();
  let nextId = { var count : Nat = 0 };

  include ProjectsApi(projects, tasks, nextId);
  include TasksApi(tasks, nextId);
  include SyncApi(projects, tasks);
};
