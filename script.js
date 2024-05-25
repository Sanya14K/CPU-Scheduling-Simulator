document.addEventListener("DOMContentLoaded", function() {

    const addProcessBtn = document.querySelector('#addProcessBtn');
    const calculateBtn = document.querySelector('#calculateBtn');
    const resetBtn = document.querySelector('#resetBtn');
    const deleteProcessBtn = document.querySelector('#delProcessBtn');
    
    // console.log("Document is ready!");


    let display = true;


    var algorithmDropdownItems = document.querySelector("#algorithmSelector");
    // console.log(algorithmDropdownItems);

    let ALGO = "optFCFS";
    let processList = [];
    let id=1;

    var processID = document.querySelector('#processID');
    processID.value = 'P'+id;


    let avgWaitingTime = 0;
    let avgTurnAroundTime = 0;
    let avgResponseTime = 0;





    function clearData(){
        processList = [];

        let tbody = document.querySelector('.oldInput'); // Get the tbody element

        // Remove all child nodes (table rows) from the tbody
        while (tbody.firstChild) {
            tbody.removeChild(tbody.firstChild);
        }

        // console.table(processList);

        id=1;
        processID.value = 'P'+id;

        let outbody = document.querySelector('.outputBody');
        while (outbody.firstChild) {
            outbody.removeChild(outbody.firstChild);
        }

        document.querySelector('#arrivalTime').value = '';
        document.querySelector('#burstTime').value = '';
        document.querySelector('#priority').value = '';


        document.querySelector('#arrivalTime').classList.remove('is-invalid');
        document.querySelector('#burstTime').classList.remove('is-invalid');
        document.querySelector('#priority').classList.remove('is-invalid');

        let ganttHeading = document.querySelector('#gantt-heading');
        ganttHeading.classList.add("hidden");
        let ganttChart = document.querySelector('.gantt-table-tr');
        while (ganttChart.firstChild) {
            ganttChart.removeChild(ganttChart.firstChild);
        }


    };
    resetBtn.addEventListener("click", clearData);



    function displayOutput(){

        let tableBody = document.querySelector('.outputBody');

            for(p in processList){
                let newRow = document.createElement('tr');

                let cell1 = document.createElement('td');
                cell1.textContent = 'P' + processList[p].processID;

                let cell2 = document.createElement('td');
                cell2.textContent = processList[p].arrivalTime; 

                let cell3 = document.createElement('td');
                cell3.textContent = processList[p].burstTime;  

                let cell5 = document.createElement('td');
                cell5.textContent = processList[p].ct;  

                let cell6 = document.createElement('td');
                cell6.textContent = processList[p].tut;  

                let cell7 = document.createElement('td');
                cell7.textContent = processList[p].wt;  

                let cell8 = document.createElement('td');
                cell8.textContent = processList[p].rt;  
                

                // Append cells to the new row
                newRow.appendChild(cell1);
                newRow.appendChild(cell2);
                newRow.appendChild(cell3);
                if(ALGO ===  "optPriorityP" || ALGO === "optPriorityNP"){
                    var cell4 = document.createElement('td');
                    cell4.textContent = processList[p].priority; 
                    newRow.appendChild(cell4);
                }
                newRow.appendChild(cell5);
                newRow.appendChild(cell6);
                newRow.appendChild(cell7);
                newRow.appendChild(cell8);
                
                // Append the new row to the table body
                tableBody.appendChild(newRow);
            }


            let avgRow = document.createElement('tr');

            let cell1 = document.createElement('td');
            cell1.textContent = '';

            let cell2 = document.createElement('td');
            cell2.textContent = '';

            let cell3 = document.createElement('td');
            cell3.textContent = '';

            let cell5 = document.createElement('td');
            cell5.textContent = 'Average : ';
            cell5.style.fontWeight = 'bold';
            cell5.style.borderLeft = 'none';
            cell5.style.textAlign = 'right'; 
            

            let cell6 = document.createElement('td');
            cell6.textContent = Math.round(avgTurnAroundTime * 100) / 100;

            let cell7 = document.createElement('td');
            cell7.textContent = Math.round(avgWaitingTime * 100) / 100;

            let cell8 = document.createElement('td');
            cell8.textContent = Math.round(avgResponseTime * 100) / 100;



            avgRow.appendChild(cell1);
            avgRow.appendChild(cell2);
            avgRow.appendChild(cell3);
            if(ALGO ===  "optPriorityP" || ALGO === "optPriorityNP"){
                let cell4 = document.createElement('td');
                cell4.textContent = ''; 
                avgRow.appendChild(cell4);
            }
            avgRow.appendChild(cell5);
            avgRow.appendChild(cell6);
            avgRow.appendChild(cell7);
            avgRow.appendChild(cell8);

            let cells = avgRow.cells;
            for (let i = 1; i < 3; i++) {
                cells[i].style.display = "none";
            }
            cells[0].colSpan = 3;
            cells[0].style.borderRight = 'none';

            if(ALGO ===  "optPriorityP" || ALGO === "optPriorityNP"){
                cells[3].style.display = "none";
                cells[0].colSpan = 4;
            }
        
            tableBody.appendChild(avgRow);
    }



    function createGanttChart(gc){
        if(gc.length === 0) return;

        const heading =  document.querySelector('#gantt-heading');
        heading.classList.remove("hidden");

        let starting = gc[0].startTime;
        let ending = gc[gc.length - 1].endTime;

        // console.log(`starting = ${starting} ending = ${ending}`);


        let maxLimit = 7;

        
        const numberOfCells = gc.length;

        const table = document.querySelector('.gantt-table');

        let row = document.querySelector('.gantt-table-tr');

        

        for (let i = 0; i < numberOfCells; i++) {

            // let lastRowIndex = table.rows.length - 1;
            // let lastRow = table.rows[lastRowIndex];
            // console.log('last Row ->');
            // console.log(lastRow);
            // console.log(lastRow.cells.length);

            // if(lastRow.cells.length > maxLimit){
            //     console.log('reached hereeeee');
            //     var newRow = document.createElement('tr');
            //     newRow.className = 'gantt-table-tr';
            //     table.appendChild(newRow);
            //     row = newRow;
            // }
            
            // Create a new cell in the row
            const cell = row.insertCell();
            cell.className = 'cell';

            cell.innerHTML = `
                <div class="main-text">${gc[i].processID}</div>
                <div class="small-text bottom-left">${gc[i].startTime}</div>
                <div class="small-text bottom-right">${gc[i].endTime}</div>
            `;
        }


    };




    deleteProcessBtn.addEventListener("click" , function(){

        
        let tbody = document.querySelector('.oldInput'); // Get the tbody element
        let rows = tbody.querySelectorAll('tr'); // Get all rows inside the tbody

        let pId = document.querySelector('#processID'); 
        // console.log(pId);
        if(id > 1) pId.value = 'P'+(id-1);


        if (rows.length > 0) {
            id--;
            // console.log(`Now id = ${id}`);
            // If there are rows, remove the last row
            tbody.removeChild(rows[rows.length - 1]);
            processList.pop();

        }
        else{
            alert('No process to delete');
            return;
        }



        // clear output
        let outbody = document.querySelector('.outputBody');
        while (outbody.firstChild) {
            outbody.removeChild(outbody.firstChild);
        }

        document.querySelector('#arrivalTime').value = '';
        document.querySelector('#burstTime').value = '';
        document.querySelector('#priority').value = '';

        document.querySelector('#arrivalTime').classList.remove('is-invalid');
        document.querySelector('#burstTime').classList.remove('is-invalid');
        document.querySelector('#priority').classList.remove('is-invalid');

        let ganttHeading = document.querySelector('#gantt-heading');
        ganttHeading.classList.add("hidden");
        let ganttChart = document.querySelector('.gantt-table-tr');
        while (ganttChart.firstChild) {
            ganttChart.removeChild(ganttChart.firstChild);
        }


    
        // console.log('after deleting ->')
        // console.table(processList);


    });

  

    algorithmDropdownItems.addEventListener("change", function() {

        // clear the table

        clearData();


        // Get the selected value
        var selectedAlgorithm = algorithmDropdownItems.value;

        // console.log(selectedAlgorithm);

        if(selectedAlgorithm){
            ALGO = selectedAlgorithm;
            console.log('value h ');
            console.log(`now algo : ${ALGO}`);
        }

        // console.log(`outside algo : ${ALGO}`);


        var timeQ = document.querySelector("#tq");
        if (selectedAlgorithm === "optRR") {
            // console.log('hey');
            // console.log(timeQ.classList);
            timeQ.classList.remove("hidden");
        } else {
            timeQ.classList.add("hidden");
        }

        // Hide elements with the class "priority" if the selected algorithm is not "optPriorityP" or "optPriorityNP"
        if (selectedAlgorithm === "optPriorityP" || selectedAlgorithm === "optPriorityNP") {
            // console.log('found');
            var priorityElements = document.querySelectorAll(".priority");
            priorityElements.forEach(function(element) {
                // element.style.display = "none";
                // element.style.collapse = "hide";
                element.classList.remove("hideIt");
                
            });

        }
        else{
            var priorityElements = document.querySelectorAll(".priority");
            priorityElements.forEach(function(element) {
                // element.style.display = "none";
                // element.style.collapse = "hide";
                element.classList.add("hideIt");
                
            });

        }

    });

    
    addProcessBtn.addEventListener('click' , function(){

                // var processID = document.querySelector('#processID');
                let arrivalTime =  document.querySelector('#arrivalTime');
                let burstTime = document.querySelector('#burstTime');
                let priorityVal = document.querySelector('#priority');

                // processID.value = id;



                if(arrivalTime.value === '' || parseInt(arrivalTime.value, 10) < 0 ){
                    arrivalTime.classList.add('is-invalid');
                    return;
                }
                else{
                    arrivalTime.classList.remove('is-invalid');
                }


                if(burstTime.value === '' || parseInt(burstTime.value, 10) < 0 ){
                    burstTime.classList.add('is-invalid');
                    return;
                }
                else{
                    burstTime.classList.remove('is-invalid');
                }

                if(ALGO ===  "optPriorityP" || ALGO === "optPriorityNP"){
                    if(priorityVal.value === '' || parseInt(priorityVal.value, 10)<0){
                        priorityVal.classList.add('is-invalid');
                        return;
                    }
                    else{
                        priorityVal.classList.remove('is-invalid');
                    }
                }


                
                let process = {
                    processID: id,
                    // processID: parseInt(processID.value, 10),
                    arrivalTime: parseInt(arrivalTime.value, 10),
                    burstTime: parseInt(burstTime.value, 10),
                    priority : parseInt(priorityVal.value, 10),
                    ct:0,
                    tut:0,
                    wt: 0,
                    rt: 0         
                }

                processList.push(process);


                var tableBody = document.querySelector('.oldInput');
                var newRow = document.createElement('tr');

                var cell1 = document.createElement('td');
                cell1.textContent = processID.value; 
                var cell2 = document.createElement('td');
                cell2.textContent = arrivalTime.value; 
                var cell3 = document.createElement('td');
                cell3.textContent = burstTime.value; 



                // Append cells to the new row
                newRow.appendChild(cell1);
                newRow.appendChild(cell2);
                newRow.appendChild(cell3);
                if(ALGO ===  "optPriorityP" || ALGO === "optPriorityNP"){
                    var cell4 = document.createElement('td');
                    cell4.textContent = priorityVal.value; 
                    newRow.appendChild(cell4);
                }
                
                // Append the new row to the table body
                tableBody.appendChild(newRow);

                // processID.value = '';
                arrivalTime.value = '';
                burstTime.value = '';
                priorityVal.value = '';

                id++;

                processID.value = 'P'+id;


                // console.table(processList);

    });




    calculateBtn.addEventListener('click' , function(){

            if (processList.length == 0) {
                alert('Please insert some processes');
                return;
            }


            // clear output if there is any old output
            let outbody = document.querySelector('.outputBody');
            while (outbody.firstChild) {
                outbody.removeChild(outbody.firstChild);
            }

            document.querySelector('#arrivalTime').value = '';
            document.querySelector('#burstTime').value = '';
            document.querySelector('#priority').value = '';


            document.querySelector('#arrivalTime').classList.remove('is-invalid');
            document.querySelector('#burstTime').classList.remove('is-invalid');
            document.querySelector('#priority').classList.remove('is-invalid');

            let ganttHeading = document.querySelector('#gantt-heading');
            ganttHeading.classList.add("hidden");
            let ganttChart = document.querySelector('.gantt-table-tr');
            while (ganttChart.firstChild) {
                ganttChart.removeChild(ganttChart.firstChild);
            }
            

            if(ALGO === "optFCFS"){
                fcfs();
            }
            else if(ALGO === "optSJF"){
                sjf();
            }
            else if(ALGO === "optSRTF"){
                srtf();
            }
            else if(ALGO === "optLJF"){
                ljf();
            }
            else if(ALGO === "optLRTF"){
                lrtf();
            }
            else if(ALGO === "optPriorityNP"){
                priorityNP();
            }
            else if(ALGO === "optPriorityP"){
                priorityP();
            }
            else if(ALGO === "optRR"){
                rr();
            }

            if(display === true){
                displayOutput();
            }
            

    });


    async function fcfs(){

                let dummyProcessList = [...processList];

                dummyProcessList.sort((a, b) => a.arrivalTime - b.arrivalTime); 

                let clock = 0;
                let waitingTime = 0;
                let turnAroundTime = 0;
                let responseTime = 0;

                let ganttChart = [];

                let firstProcess = dummyProcessList[0];
                firstProcess.wt = 0;
                firstProcess.ct = firstProcess.arrivalTime + firstProcess.burstTime;
                firstProcess.tut = firstProcess.ct-firstProcess.arrivalTime;
                firstProcess.rt = firstProcess.wt; // for non-prreemptive , rt=wt

                if(firstProcess.arrivalTime !== 0){
                    ganttChart.push({
                        processID: '-',
                        startTime: 0,
                        endTime: firstProcess.arrivalTime,
                    });
                }
                
                
                
                ganttChart.push({
                        processID: 'P' + firstProcess.processID,
                        startTime: firstProcess.arrivalTime,
                        endTime: firstProcess.ct,
                });

                waitingTime += firstProcess.wt;
                turnAroundTime += firstProcess.tut;

                for (let i = 1; i < dummyProcessList.length; i++) {
                    let process = dummyProcessList[i];

                    process.wt = Math.max(dummyProcessList[i-1].ct - process.arrivalTime , 0);
                    process.ct = process.arrivalTime + process.wt + process.burstTime;
                    process.tut = process.ct - process.arrivalTime;
                    process.rt = process.wt; // for non-prreemptive , rt=wt

                    // Update Gantt Chart
                    ganttChart.push({
                        processID: 'P' + process.processID,
                        startTime: process.arrivalTime + process.wt,
                        endTime: process.ct,
                    });

                    turnAroundTime += process.tut;
                    waitingTime += process.wt;
                    responseTime += process.rt;


                    // Update current time
                    clock += process.burstTime;
                }


                avgWaitingTime = waitingTime / processList.length;
                avgTurnAroundTime = turnAroundTime / processList.length;
                avgResponseTime = responseTime/ processList.length;


                // console.table(ganttChart);
                // console.table(processList);
                // console.log(avgWaitingTime);
                // console.log(avgTurnAroundTime);
                // console.log(avgResponseTime);


                createGanttChart(ganttChart);

    };   



    async function sjf()
    {
            let len = processList.length;

            let clock = 0;
            let completed = 0;


            let flag = new Array(len).fill(0); // flagged 1 if process is completed

            let ganttChart = [];

            let waitingTime = 0;
            let turnAroundTime = 0;
            let responseTime = 0;
            

            while(completed < len)
            {
            
                let min = Number.MAX_VALUE;
                let p = len; // p represents the index of upcoming process in processList
                
                for(let i=0; i<len; i++)
                {
                    /*
                     * If i'th process arrival time <= system time and its flag=0 and burst<min 
                     * That process will be executed first 
                     */ 
                    if ((processList[i].arrivalTime <= clock) && (flag[i] === 0) && (processList[i].burstTime < min)){
                        min=processList[i].burstTime;
                        p = i;
                    } 

                    // fcfs is the tie-breaker in case of processes with same burst times
                    else if ((processList[i].arrivalTime <= clock) && (flag[i] === 0) && (processList[i].burstTime === min)){
                        if(processList[i].arrivalTime < processList[p].arrivalTime){
                            min =processList[i].burstTime;
                            p = i;
                        }   
                    } 

                }


                /* If p==len means p value can not updated because no process arrival time< system time so we increase the system time */
                if(p === len){
                    // console.log(`No process to execute at clock ${clock}`);
                    clock++;
                }    
                else
                {

                    if((ganttChart.length === 0) && (clock !== 0)){
                        ganttChart.push({
                            processID: '-',
                            startTime: 0,
                            endTime: clock,
                        });
                    }

                    if((ganttChart.length>0) && (clock !== ganttChart[ganttChart.length - 1].endTime)){
                        ganttChart.push({
                            processID: '-',
                            startTime: ganttChart[ganttChart.length - 1].endTime,
                            endTime: clock,
                        });
                    }


                    processList[p].ct = clock + processList[p].burstTime;
                    processList[p].tut = processList[p].ct - processList[p].arrivalTime;
                    processList[p].wt = processList[p].tut - processList[p].burstTime;
                    processList[p].rt = processList[p].wt; // for non-prreemptive , rt=wt

                    clock += processList[p].burstTime;
                    flag[p]=1;
                    completed++; 
                    
                    waitingTime += processList[p].wt;
                    turnAroundTime += processList[p].tut;
                    responseTime += processList[p].rt;

                    ganttChart.push({
                        processID: 'P' + processList[p].processID,
                        startTime: processList[p].arrivalTime + processList[p].wt,
                        endTime: processList[p].ct,
                    });

                }
            }


            avgWaitingTime = waitingTime/len;
            avgTurnAroundTime = turnAroundTime/len;
            avgResponseTime = responseTime/len;

            // console.table(ganttChart);
            // console.table(processList);
            // console.log(avgWaitingTime);
            // console.log(avgTurnAroundTime);
            // console.log(avgResponseTime);

            createGanttChart(ganttChart);
    };



   function srtf(){
        let len = processList.length;

        let clock = 0;



        let bt = new Array(len); // flagged 1 if process is completed
        for(let i=0 ; i<len ; i++){
            bt[i] = processList[i].burstTime;
        }

        let ganttChart = [];

        let waitingTime = 0;
        let turnAroundTime = 0;
        let responseTime = 0;
            

        while(true)
        {
            
            let min = Number.MAX_VALUE;
            let p = len; // p represents the index of upcoming process in processList

            let isAnyProcessLeft = false;

            for(let i=0; i<len; i++)
            {
                /*
                 * If i'th process arrival time <= system time and its flag=0 and burst<min 
                 * That process will be executed first 
                 */ 
                if ((processList[i].arrivalTime <= clock) && (bt[i] > 0) && (bt[i] < min)){
                    isAnyProcessLeft = true;
                    min = bt[i];
                    p = i;
                } 

                else if ((processList[i].arrivalTime <= clock) && (bt[i] > 0) && (bt[i] === min)){
                    isAnyProcessLeft = true;
                    // tie breaker for equal burst times : fcfs
                    if(processList[i].arrivalTime < processList[p].arrivalTime){
                        min = bt[i];
                        p = i;
                    }   
                } 

            }

            if(!isAnyProcessLeft) break;


            /* If p==len means p value can not updated because no process arrival time< system time so we increase the system time */
            if(p === len){
                // console.log(`No process to execute at clock ${clock}`);
                clock++;
            }    
            else
            {

                // console.log(`executed P${processList[p].processID} at clock${clock}`);

                if((ganttChart.length === 0) && (clock !== 0)){
                        ganttChart.push({
                            processID: '-',
                            startTime: 0,
                            endTime: clock
                        });
                }
                if((ganttChart.length>0) && (clock !== ganttChart[ganttChart.length - 1].endTime)){
                        ganttChart.push({
                            processID: '-',
                            startTime: ganttChart[ganttChart.length - 1].endTime,
                            endTime: clock
                        });

                }
                if((ganttChart.length>0) && (ganttChart[ganttChart.length - 1].processID === 'P'+processList[p].processID)){
                    ganttChart[ganttChart.length - 1].endTime = clock+1;
                }
                
 
                if(bt[p] === processList[p].burstTime){ // process is alloted first time
                    processList[p].rt = clock - processList[p].arrivalTime; 
                    responseTime += processList[p].rt;

                    ganttChart.push({
                        processID: 'P'+ processList[p].processID,
                        startTime: clock,
                        endTime: clock + 1
                    });
                }

                if((ganttChart.length>0) && (ganttChart[ganttChart.length - 1].processID !== 'P'+processList[p].processID)){
                    ganttChart.push({
                        processID: 'P'+ processList[p].processID,
                        startTime: clock,
                        endTime: clock + 1
                    });
                }


                bt[p]--;
                if(bt[p] === 0){
                    processList[p].ct = clock+1;
                    processList[p].tut = processList[p].ct - processList[p].arrivalTime;
                    processList[p].wt = processList[p].tut - processList[p].burstTime;
                }


                clock++;
                    
                waitingTime += processList[p].wt;
                turnAroundTime += processList[p].tut;
                
            }
        }


        avgWaitingTime = waitingTime/len;
        avgTurnAroundTime = turnAroundTime/len;
        avgResponseTime = responseTime/len;

        // console.table(processList);
        // console.log(avgWaitingTime);
        // console.log(avgTurnAroundTime);
        // console.log(avgResponseTime);
        // console.table(ganttChart);

        createGanttChart(ganttChart);

    };



    async function ljf()
    {
            let len = processList.length;

            let clock = 0;
            let completed = 0;


            let flag = new Array(len).fill(0); // flagged 1 if process is completed

            let ganttChart = [];

            let waitingTime = 0;
            let turnAroundTime = 0;
            let responseTime = 0;
            

            while(completed < len)
            {
            
                let max = -1;
                let p = len; // p represents the index of upcoming process in processList
                
                for(let i=0; i<len; i++)
                {
                    /*
                     * If i'th process arrival time <= system time and its flag=0 and burst<min 
                     * That process will be executed first 
                     */ 
                    if ((processList[i].arrivalTime <= clock) && (flag[i] === 0) && (processList[i].burstTime > max)){
                        max = processList[i].burstTime;
                        p = i;
                    } 

                    else if ((processList[i].arrivalTime <= clock) && (flag[i] === 0) && (processList[i].burstTime === max)){
                        if(processList[i].arrivalTime < processList[p].arrivalTime){
                            max =processList[i].burstTime;
                            p = i;
                        }   
                    } 

                }


                /* If p==len means p value can not updated because no process arrival time< system time so we increase the system time */
                if(p === len){
                    // console.log(`No process to execute at clock ${clock}`);
                    clock++;
                }    
                else
                {
                    if((ganttChart.length === 0) && (clock !== 0)){
                        ganttChart.push({
                            processID: '-',
                            startTime: 0,
                            endTime: clock,
                        });
                    }

                    if((ganttChart.length>0) && (clock !== ganttChart[ganttChart.length - 1].endTime)){
                        ganttChart.push({
                            processID: '-',
                            startTime: ganttChart[ganttChart.length - 1].endTime,
                            endTime: clock,
                        });
                    }

                    processList[p].ct = clock + processList[p].burstTime;
                    processList[p].tut = processList[p].ct - processList[p].arrivalTime;
                    processList[p].wt = processList[p].tut - processList[p].burstTime;
                    processList[p].rt = processList[p].wt; // for non-prreemptive , rt=wt

                    clock += processList[p].burstTime;
                    flag[p]=1;
                    completed++; 
                    
                    waitingTime += processList[p].wt;
                    turnAroundTime += processList[p].tut;
                    responseTime += processList[p].rt;


                    ganttChart.push({
                        processID: 'P' + processList[p].processID,
                        startTime: processList[p].arrivalTime + processList[p].wt,
                        endTime: processList[p].ct,
                    });

                }
            }


            avgWaitingTime = waitingTime/len;
            avgTurnAroundTime = turnAroundTime/len;
            avgResponseTime = responseTime/len;

            // console.table(processList);
            // console.log(avgWaitingTime);
            // console.log(avgTurnAroundTime);
            // console.log(avgResponseTime);

            createGanttChart(ganttChart);
    };


    function lrtf(){
       let len = processList.length;

        let clock = 0;
        let completed = 0;


        let bt = new Array(len); // flagged 1 if process is completed
        for(let i=0 ; i<len ; i++){
            bt[i] = processList[i].burstTime;
        }

        let ganttChart = [];

        let waitingTime = 0;
        let turnAroundTime = 0;
        let responseTime = 0;
            

        while(true)
        {
            
            let max = -1;
            let p = len; // p represents the index of upcoming process in processList

            let isAnyProcessLeft = false;

            for(let i=0; i<len; i++)
            {
                /*
                 * If i'th process arrival time <= system time and its flag=0 and burst<min 
                 * That process will be executed first 
                 */ 
                if ((processList[i].arrivalTime <= clock) && (bt[i] > 0) && (bt[i] > max)){
                    isAnyProcessLeft = true;
                    max = bt[i];
                    p = i;
                } 

                else if ((processList[i].arrivalTime <= clock) && (bt[i] > 0) && (bt[i] === max)){
                    isAnyProcessLeft = true;
                    // tie breaker for equal burst times : fcfs
                    if(processList[i].arrivalTime < processList[p].arrivalTime){
                        max = bt[i];
                        p = i;
                    }   
                } 

            }

            if(!isAnyProcessLeft) break;


            /* If p==len means p value can not updated because no process arrival time< system time so we increase the system time */
            if(p === len){
                // console.log(`No process to execute at clock ${clock}`);
                clock++;
            }    
            else
            {

                // console.log(`executed P${processList[p].processID} at clock${clock}`);

                if((ganttChart.length === 0) && (clock !== 0)){
                        ganttChart.push({
                            processID: '-',
                            startTime: 0,
                            endTime: clock
                        });
                }
                if((ganttChart.length>0) && (clock !== ganttChart[ganttChart.length - 1].endTime)){
                        ganttChart.push({
                            processID: '-',
                            startTime: ganttChart[ganttChart.length - 1].endTime,
                            endTime: clock
                        });

                }
                if((ganttChart.length>0) && (ganttChart[ganttChart.length - 1].processID === 'P'+processList[p].processID)){
                    ganttChart[ganttChart.length - 1].endTime = clock+1;
                }

                 
                if(bt[p] === processList[p].burstTime){ // process is alloted first time
                    processList[p].rt = clock - processList[p].arrivalTime; 
                    responseTime += processList[p].rt;

                    ganttChart.push({
                        processID: 'P'+ processList[p].processID,
                        startTime: clock,
                        endTime: clock + 1
                    });
                }

                if((ganttChart.length>0) && (ganttChart[ganttChart.length - 1].processID !== 'P'+processList[p].processID)){
                    ganttChart.push({
                        processID: 'P'+ processList[p].processID,
                        startTime: clock,
                        endTime: clock + 1
                    });
                }

                


                bt[p]--;
                if(bt[p] === 0){
                    processList[p].ct = clock+1;
                    processList[p].tut = processList[p].ct - processList[p].arrivalTime;
                    processList[p].wt = processList[p].tut - processList[p].burstTime;
                }


                clock++;
                completed++; 
                    
                waitingTime += processList[p].wt;
                turnAroundTime += processList[p].tut;
                
            }
        }


        avgWaitingTime = waitingTime/len;
        avgTurnAroundTime = turnAroundTime/len;
        avgResponseTime = responseTime/len;

        // console.table(processList);
        // console.log(avgWaitingTime);
        // console.log(avgTurnAroundTime);
        // console.log(avgResponseTime);

        createGanttChart(ganttChart);

    };

    

    function priorityNP(){

        
        let min = Number.MAX_VALUE;
        let p;
        let processQueue = [];
        let len = processList.length;
        
        let clock = 0;


        let dummyProcessList = [...processList];

        let ganttChart = [];


        let waitingTime = 0;
        let turnAroundTime = 0;
        let responseTime = 0;




        while (dummyProcessList.length != 0) {

            for (let process in dummyProcessList) {
                if (dummyProcessList[process].arrivalTime <= clock) {
                    processQueue.push(dummyProcessList[process]);
                }
            }
            if (processQueue.length === 0) {
                clock++;
                continue;
            }


            min = Number.MAX_VALUE;
 
            for (let process in processQueue) {
                if (processQueue[process].priority < min) {
                    min = processQueue[process].priority;
                    p = process;
                }

                else if (processQueue[process].priority === min){
                    if(processQueue[process].arrivalTime < processQueue[p].arrivalTime){
                        min = processQueue[process].priority;
                        p = process;
                    }   
                } 
            }


            if((ganttChart.length === 0) && (clock !== 0)){
                ganttChart.push({
                    processID: '-',
                    startTime: 0,
                    endTime: clock
                });
            }
            if((ganttChart.length>0) && (clock !== ganttChart[ganttChart.length - 1].endTime)){
                ganttChart.push({
                    processID: '-',
                    startTime: ganttChart[ganttChart.length - 1].endTime,
                    endTime: clock
                });
            }
            

            ganttChart.push({
                processID: 'P'+ processQueue[p].processID,
                startTime: clock,
                endTime: clock + processQueue[p].burstTime
            });

            clock += processQueue[p].burstTime;


            processQueue[p].ct = clock;
            processQueue[p].tut = clock - processQueue[p].arrivalTime;
            processQueue[p].wt = processQueue[p].tut - processQueue[p].burstTime;
            processQueue[p].rt = processQueue[p].wt;

            turnAroundTime += processQueue[p].tut;
            waitingTime += processQueue[p].wt;
            responseTime += processQueue[p].rt;

            for (pro in dummyProcessList) {
                if ( dummyProcessList[pro].processID === processQueue[p].processID )
                    dummyProcessList.splice(pro, 1);
            }
            processQueue.splice(0, processQueue.length);
        }



        let completionTimePriority = clock;
        avgWaitingTime = waitingTime/len;
        avgTurnAroundTime = turnAroundTime/len;
        avgResponseTime = responseTime/len;

        // console.table(processList);
        // console.log(avgWaitingTime);
        // console.log(avgTurnAroundTime);
        // console.log(avgResponseTime);
        // console.table(ganttChart);

        createGanttChart(ganttChart);


    };


    async function priorityP() {

        let min = Number.MAX_VALUE;
        let p;
        
        let processQueue = [];

        let waitingTime = 0;
        let turnAroundTime = 0;
        let responseTime = 0;


        let clock = 0;

        let dummyProcessList = [...processList];

        let ganttChart = [];

        let len = processList.length;
        let bt = new Array(len); 
        for(let i=0 ; i<len ; i++){
            bt[i] = processList[i].burstTime;
        }



        while (dummyProcessList.length != 0) {

            for (let process in dummyProcessList) {
                if (dummyProcessList[process].arrivalTime <= clock){
                    processQueue.push(dummyProcessList[process]);
                }
                    
            }

            // console.log('selected processes : ');
            // console.table(processQueue);

            if (processQueue.length == 0) {
                // console.log(`No process to execute at clock ${clock}`);
                clock++;
                continue;
            }

            min = Number.MAX_VALUE;

            for (let process in processQueue) {
                if (processQueue[process].priority < min) {
                    min = processQueue[process].priority;
                    p = process;
                }

                else if (processQueue[process].priority === min){
                    if(processQueue[process].arrivalTime < processQueue[p].arrivalTime){
                        min = processQueue[process].priority;
                        p = process;
                    }   
                } 
            }


            // console.log(`executed P${processQueue[p].processID} at clock${clock}`);

            if((ganttChart.length === 0) && (clock !== 0)){
                // console.log(`P${processQueue[p].processID} entered A`);
                ganttChart.push({
                    processID: '-',
                    startTime: 0,
                    endTime: clock
                });
            }
            if((ganttChart.length>0) && (clock !== ganttChart[ganttChart.length - 1].endTime)){
                // console.log(`P${processQueue[p].processID} entered B`);
                ganttChart.push({
                    processID: '-',
                    startTime: ganttChart[ganttChart.length - 1].endTime,
                    endTime: clock
                });
            }
            if((ganttChart.length>0) && (ganttChart[ganttChart.length - 1].processID === 'P'+processQueue[p].processID)){
                // console.log(`P${processQueue[p].processID} entered C`);
                    ganttChart[ganttChart.length - 1].endTime = clock+1;
            }


            if ( processQueue[p].burstTime === bt[processQueue[p].processID-1] ) {
                //It means came for the first time
                processQueue[p].rt = clock - processQueue[p].arrivalTime;

                // console.log(`P${processQueue[p].processID} entered D`);
                ganttChart.push({
                    processID: 'P'+ processQueue[p].processID,
                    startTime: clock,
                    endTime: clock + 1
                });
            }

            if((ganttChart.length>0) && (ganttChart[ganttChart.length - 1].processID !== 'P'+processQueue[p].processID)){

                // console.log(`P${processQueue[p].processID} entered E`);

                ganttChart.push({
                    processID: 'P'+ processQueue[p].processID,
                    startTime: clock,
                    endTime: clock + 1
                });
            }



            let index;
            for (pro in dummyProcessList) {
                if (dummyProcessList[pro].processID === processQueue[p].processID)
                index = pro;
            }

            clock++;
            bt[processQueue[p].processID-1]--;

            // console.log(`After looping bt of P${processList[p].processID} = ${bt[processQueue[p].processID-1]}`);


            if (bt[processQueue[p].processID-1] === 0) {
                processQueue[p].ct = clock;
                dummyProcessList.splice(index, 1);

                // console.log(`Now dummy process list : `);
                // console.table(dummyProcessList);
            }
            processQueue.splice(0, processQueue.length);

            // console.log('Now process queue :');
            // console.table(processQueue);

            
        }


        for (p in processList) {
            processList[p].tut = processList[p].ct - processList[p].arrivalTime;
            processList[p].wt = processList[p].tut - processList[p].burstTime;

            turnAroundTime += processList[p].tut;
            waitingTime += processList[p].wt;
            responseTime += processList[p].rt;
        }
        


        let completionTimePriority = clock;
        avgWaitingTime = waitingTime/len;
        avgTurnAroundTime = turnAroundTime/len;
        avgResponseTime = responseTime/len;

        // console.table(processList);
        // console.log(avgWaitingTime);
        // console.log(avgTurnAroundTime);
        // console.log(avgResponseTime);
        // console.table(ganttChart);

        createGanttChart(ganttChart);

    };


    async function rr(){

        // console.table(processList);

        let timeQuanta = Number(document.querySelector("#timeQuantum").value);

        if(timeQuanta < 0){
            alert("Time Quantum cannot be negative");
            display = false;
            return;
        }
        else{
            display = true;
        }

        if (timeQuanta == 0)
            timeQuanta = 90;

        let clock = 0;

        let len = processList.length;
        let bt = new Array(len); 
        for(let i=0 ; i<len ; i++){
            bt[i] = processList[i].burstTime;
        }


        let ganttChart = [];


        let min, p, j, flag;

        let dummyProcessList = [...processList];


        let readyQueue = [];

        // dummyProcessList.sort((a, b) => a.arrivalTime - b.arrivalTime); 

        let runningQueue = [];


        // getting the initial processes in to the process queue
        while (true) {

            if (dummyProcessList.length == 0)
                break;

            for(let i=0 ; i<dummyProcessList.length ; i++) {
                if (dummyProcessList[i].arrivalTime <= clock) {
                    readyQueue.push(dummyProcessList[i]);
                }
            }

            if (readyQueue.length === 0) {
                clock++;
                continue;
            }

            break;
        }








        //then one by one all the processes
        while (readyQueue.length != 0) {

            // prev_time = clock;
            let currentProcess = readyQueue[0];

            if (currentProcess.burstTime === bt[(currentProcess.processID)-1]) {
                //It means came for the first time
                currentProcess.rt = clock - currentProcess.arrivalTime;
            }


            if (bt[(currentProcess.processID)-1] > timeQuanta) { // process covers complete time quanta and still left
                
                if((ganttChart.length === 0) && (clock !== 0)){
                    ganttChart.push({
                        processID: '-',
                        startTime: 0,
                        endTime: clock
                    });
                }

                if((ganttChart.length>0) && (clock !== ganttChart[ganttChart.length - 1].endTime)){
                    ganttChart.push({
                        processID: '-',
                        startTime: ganttChart[ganttChart.length - 1].endTime,
                        endTime: clock
                    });
                }
            
                ganttChart.push({
                    processID: 'P'+ currentProcess.processID,
                    startTime: clock,
                    endTime: clock + timeQuanta
                });



                bt[(currentProcess.processID)-1] -= timeQuanta;
                clock += timeQuanta;
                flag = true; 

            } else {  // process does not cover complete time quanta or just completes it

                if((ganttChart.length === 0) && (clock !== 0)){
                    ganttChart.push({
                        processID: '-',
                        startTime: 0,
                        endTime: clock
                    });
                }

                if((ganttChart.length>0) && (clock !== ganttChart[ganttChart.length - 1].endTime)){
                    ganttChart.push({
                        processID: '-',
                        startTime: ganttChart[ganttChart.length - 1].endTime,
                        endTime: clock
                    });
                }

                ganttChart.push({
                    processID: 'P'+ currentProcess.processID,
                    startTime: clock,
                    endTime: clock + bt[(currentProcess.processID)-1]
                });
                

                flag = false;
                clock += bt[(currentProcess.processID)-1];
                currentProcess.ct = clock;
                for (let i in dummyProcessList) {
                    if (dummyProcessList[i].processID == currentProcess.processID) {
                        dummyProcessList.splice(i, 1); // remove the process from list
                        break;
                    }
                }
            }

            // console.log(`after executing ${currentProcess.processID} , clock : ${clock}`);






            //Taking remaining process and pushing them in running queue
            while (true) {

                if (dummyProcessList.length == 0)
                    break;

                for(let i=0 ; i<dummyProcessList.length ; i++) {
                    if (dummyProcessList[i].arrivalTime <= clock) { ///
                        runningQueue.push(dummyProcessList[i]);
                    }
                }

        
                if (runningQueue.length === 0) {
                    clock++;
                    continue;
                }


                // now taking those processes from running queue to process queue which has minimum arrival time
                while (runningQueue.length != 0) {
                    min = Number.MAX_VALUE;
                    for (i in runningQueue) {
                        if (runningQueue[i].arrivalTime < min) {
                            min = runningQueue[i].arrivalTime;
                            j = i;
                        }
                    }

                    if (!readyQueue.includes(runningQueue[j])) {
                        readyQueue.push(runningQueue[j]);
                    }
                    runningQueue.splice(j, 1);
                }

                break;
            }
            


            if (flag == true) { // agar process bachi h to peeche push kr do
                readyQueue.push(currentProcess);
            }

            readyQueue.shift();


        }





        let turnAroundTime = 0;
        let responseTime = 0;
        let waitingTime = 0;

        for (p in processList) {
            processList[p].tut = processList[p].ct - processList[p].arrivalTime;
            processList[p].wt = processList[p].tut - processList[p].burstTime;

            turnAroundTime += processList[p].tut;
            waitingTime += processList[p].wt;
            responseTime += processList[p].rt;
        }

        let completionTime = clock;
        avgWaitingTime = waitingTime/len;
        avgTurnAroundTime = turnAroundTime/len;
        avgResponseTime = responseTime/len;


        // console.table(processList);
        // console.log(avgTurnAroundTime);
        // console.log(avgWaitingTime);
        // console.log(avgResponseTime);
        // console.table(ganttChart);

        createGanttChart(ganttChart);
        
    };




});



