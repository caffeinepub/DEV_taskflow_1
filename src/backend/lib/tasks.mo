import List "mo:core/List";
import Types "../types/tasks";
import Common "../types/common";

module {
  public func listTasks(tasks : List.List<Types.Task>) : [Types.Task] {
    tasks.toArray();
  };

  public func getTasksByProject(tasks : List.List<Types.Task>, projectId : Common.ProjectId) : [Types.Task] {
    tasks.filter(func(t) { t.projectId == projectId }).toArray();
  };

  public func getTask(tasks : List.List<Types.Task>, id : Common.TaskId) : ?Types.Task {
    tasks.find(func(t) { t.id == id });
  };

  public func createTask(
    tasks : List.List<Types.Task>,
    id : Common.TaskId,
    projectId : Common.ProjectId,
    parentId : ?Common.TaskId,
    title : Text,
    description : Text,
    dueDate : ?Int,
    priority : Types.Priority,
    order : Nat,
    tags : [Text],
    recurringFrequency : Types.RecurringFrequency,
    now : Common.Timestamp,
  ) : Types.Task {
    let task : Types.Task = {
      id;
      projectId;
      parentId;
      title;
      description;
      dueDate;
      priority;
      completed = false;
      order;
      tags;
      recurringFrequency;
      createdAt = now;
      updatedAt = now;
    };
    tasks.add(task);
    task;
  };

  public func updateTask(
    tasks : List.List<Types.Task>,
    id : Common.TaskId,
    projectId : Common.ProjectId,
    parentId : ?Common.TaskId,
    title : Text,
    description : Text,
    dueDate : ?Int,
    priority : Types.Priority,
    completed : Bool,
    order : Nat,
    tags : [Text],
    recurringFrequency : Types.RecurringFrequency,
    now : Common.Timestamp,
  ) : ?Types.Task {
    var updated : ?Types.Task = null;
    tasks.mapInPlace(func(t) {
      if (t.id == id) {
        let next = {
          t with
          projectId;
          parentId;
          title;
          description;
          dueDate;
          priority;
          completed;
          order;
          tags;
          recurringFrequency;
          updatedAt = now;
        };
        updated := ?next;
        next;
      } else { t };
    });
    updated;
  };

  public func deleteTask(tasks : List.List<Types.Task>, id : Common.TaskId) {
    let kept = tasks.filter(func(t) { t.id != id });
    tasks.clear();
    tasks.append(kept);
  };

  public func deleteByProject(tasks : List.List<Types.Task>, projectId : Common.ProjectId) {
    let kept = tasks.filter(func(t) { t.projectId != projectId });
    tasks.clear();
    tasks.append(kept);
  };

  public func replaceAll(tasks : List.List<Types.Task>, incoming : [Types.Task]) {
    tasks.clear();
    for (t in incoming.values()) {
      tasks.add(t);
    };
  };
};
