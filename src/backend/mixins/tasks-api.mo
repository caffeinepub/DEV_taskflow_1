import List "mo:core/List";
import Time "mo:core/Time";
import TaskTypes "../types/tasks";
import Common "../types/common";
import TaskLib "../lib/tasks";

mixin (tasks : List.List<TaskTypes.Task>, nextId : { var count : Nat }) {
  public query func getTasks() : async [TaskTypes.Task] {
    TaskLib.listTasks(tasks);
  };

  public query func getTasksByProject(projectId : Common.ProjectId) : async [TaskTypes.Task] {
    TaskLib.getTasksByProject(tasks, projectId);
  };

  public func createTask(
    projectId : Common.ProjectId,
    parentId : ?Common.TaskId,
    title : Text,
    description : Text,
    dueDate : ?Int,
    priority : TaskTypes.Priority,
    order : Nat,
    tags : [Text],
    recurringFrequency : TaskTypes.RecurringFrequency,
  ) : async TaskTypes.Task {
    nextId.count += 1;
    let id = "t-" # nextId.count.toText();
    TaskLib.createTask(tasks, id, projectId, parentId, title, description, dueDate, priority, order, tags, recurringFrequency, Time.now());
  };

  public func updateTask(
    id : Common.TaskId,
    projectId : Common.ProjectId,
    parentId : ?Common.TaskId,
    title : Text,
    description : Text,
    dueDate : ?Int,
    priority : TaskTypes.Priority,
    completed : Bool,
    order : Nat,
    tags : [Text],
    recurringFrequency : TaskTypes.RecurringFrequency,
  ) : async ?TaskTypes.Task {
    TaskLib.updateTask(tasks, id, projectId, parentId, title, description, dueDate, priority, completed, order, tags, recurringFrequency, Time.now());
  };

  public func deleteTask(id : Common.TaskId) : async () {
    TaskLib.deleteTask(tasks, id);
  };
};
