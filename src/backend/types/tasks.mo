import Common "common";

module {
  public type Priority = { #high; #medium; #low; #none };

  public type RecurringFrequency = {
    #none;
    #daily;
    #weekly;
    #weekdays;
    #monthly;
  };

  public type Task = {
    id : Common.TaskId;
    projectId : Common.ProjectId;
    parentId : ?Common.TaskId;
    title : Text;
    description : Text;
    dueDate : ?Int;
    priority : Priority;
    completed : Bool;
    order : Nat;
    tags : [Text];
    recurringFrequency : RecurringFrequency;
    createdAt : Common.Timestamp;
    updatedAt : Common.Timestamp;
  };
};
