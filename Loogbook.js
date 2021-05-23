const { addTime, getTimeDifference } = require("./utils/time");
class Logbook {
  constructor() {
    this.isReportGenerated = false;
    this.records = [];

    // This queue is used to store all the Users with there "Start" event timings array.
    this.queue = {};

    // This variable refers to an object which keeps track of active time of each user.
    // Thus activeTimeOfUser.user_name will hold the active time of that user in HH:MM:SS format.
    this.userActiveTimes = {};

    // This is an object which keeps track of the user session count.
    // Thus userActiveSessions.user_name will hold the session count of that user.
    this.userActiveSessions = {};

    this.firstRecordTime = null;
    this.lastRecordTime = null;
  }

  addRecord({ name, time, event }) {
    if (this.isReportGenerated) {
      throw Error("Cannot add record after report is generated");
    }
    if (this.records.length === 0) {
      this.firstRecordTime = time;
    }
    this.lastRecordTime = time;
    this.queue[name] = [];
    this.records.push({
      name,
      time,
      event,
    });
  }

  setUserTime(user, time) {
    this.userActiveTimes[user] = time;
    this.userActiveSessions[user] = (this.userActiveSessions[user] || 0) + 1;
  }

  generateLogs() {
    /*
      This is the actual algorithm which takes care of calculating the active time for each user in the list.
      Following are the events and the respective actions taking place for it.

      Start - event:
        Add event in queue.
        
      End - event:
        1. activeTimeOfUser and lastStartTime:	Get last start time and record.time and store diff.
        2. !activeTimeOfUser and lastStartTime:	Get last start time and record.time and store diff.
        3. !activeTimeOfUser and !lastStartTime:	Consider 1st reacord time as start time and record.time as endTime and store diff.
        4. activeTimeOfUser and !lastStartTime:	Consider 1st reacord time as start time and record.time take diff and add (diff, activeTime).
    */
    this.records.forEach((record, idx) => {
      if (idx === 0 && record.event === "End") {
        this.setUserTime(record.name, "00:00:00"); // Because this is the first record so we can set the active time to zero.
        return;
      }

      if (record.event === "Start") {
        // For any record with "Start" event,
        // the algorithm pushes it into queue so that it can find the corrosponding "End" event of it.
        this.queue[record.name].push(record.time);
        return;
      }

      const activeTimeOfUser = this.userActiveTimes[record.name];
      const lastStartTime = this.queue[record.name].shift();

      if (record.event === "End") {
        if (lastStartTime) {
          if (activeTimeOfUser) {
            const timeDiff = getTimeDifference(lastStartTime, record.time);
            this.setUserTime(record.name, addTime(activeTimeOfUser, timeDiff));
          } else {
            const timeDiff = getTimeDifference(lastStartTime, record.time);
            this.setUserTime(record.name, timeDiff);
          }
        } else {
          if (activeTimeOfUser) {
            const timeDiff = getTimeDifference(
              this.firstRecordTime,
              record.time
            );
            this.setUserTime(record.name, addTime(activeTimeOfUser, timeDiff));
          } else {
            const timeDiff = getTimeDifference(
              this.firstRecordTime,
              record.time
            );
            this.setUserTime(record.name, timeDiff);
          }
        }
      }
    });
    for (const user in this.queue) {
      this.queue[user].forEach((time) => {
        const timeDiff = getTimeDifference(time, this.lastRecordTime);

        this.setUserTime(user, addTime(this.userActiveTimes[user], timeDiff));
      });
    }

    this.isReportGenerated = true;
    return this.userActiveTimes;
  }

  getUsersSession() {
    if (this.isReportGenerated) {
      return this.userActiveSessions;
    }
    throw Error("Report is not generated");
  }
}

module.exports = Logbook;
