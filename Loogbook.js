const { addTime, getTimeDifference } = require("./time");

/*
  End:
    1. acvtiveTime and lastStartTime:	Get last start time and record.time and store diff.
    2. !acvtiveTime and lastStartTime:	Get last start time and record.time and store diff.
    3. !acvtiveTime and !lastStartTime:	Consider 1st reacord time as start time and record.time as endTime and store diff.
    4. acvtiveTime and !lastStartTime:	Consider 1st reacord time as start time and record.time take diff and add (diff, activeTime).
*/

class Logbook {
  constructor() {
    this.isReportGenerated = false;
    this.records = [];
    this.queue = {};
    this.userActiveTimes = {};
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
    this.records.forEach((record, idx) => {
      if (idx === 0 && record.event === "End") {
        this.setUserTime(record.name, "00:00:00");
        return;
      }

      if (record.event === "Start") {
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
