document.addEventListener("DOMContentLoaded", () => {
    function sumColumn(className) {
      let total = 0;
      document.querySelectorAll("." + className).forEach(td => {
        const val = td.textContent.trim();
        if (val !== "-" && val !== "") {
          total += parseInt(val, 10);
        }
      });
      return total;
    }
  
    document.getElementById("senior_match").textContent = sumColumn("senior_match");
    document.getElementById("senior_goal").textContent = sumColumn("senior_goal");
    document.getElementById("senior_assist").textContent = sumColumn("senior_assist");
    document.getElementById("senior_own").textContent = sumColumn("senior_own");
    document.getElementById("senior_yellow").textContent = sumColumn("senior_yellow");
    document.getElementById("senior_red").textContent = sumColumn("senior_red");
    document.getElementById("senior_min").textContent = sumColumn("senior_min");

    document.getElementById("all_match").textContent = sumColumn("all_match");
    document.getElementById("all_goal").textContent = sumColumn("all_goal");
    document.getElementById("all_assist").textContent = sumColumn("all_assist");
    document.getElementById("all_own").textContent = sumColumn("all_own");
    document.getElementById("all_yellow").textContent = sumColumn("all_yellow");
    document.getElementById("all_red").textContent = sumColumn("all_red");
    document.getElementById("all_min").textContent = sumColumn("senior_min");

    document.getElementById("junior_match").textContent = sumColumn("junior_match");
    document.getElementById("junior_goal").textContent = sumColumn("junior_goal");
    document.getElementById("junior_assist").textContent = sumColumn("junior_assist");
    document.getElementById("junior_own").textContent = sumColumn("junior_own");
});