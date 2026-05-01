import{a as e,n as t,t as n}from"./jsx-runtime-dBoqvwbd.js";import{n as r,r as i,t as a}from"./BreadCrumbs-Cg_loSdV.js";import{S as o,c as s,l as c,t as l,v as u,w as d,x as f}from"./index-DRVTVEFd.js";import{t as p}from"./ClientOnly-D1zmjm45.js";import{f as m,n as h,p as g}from"./localCoursesHooks-DI6irJUH.js";import{n as _}from"./courseContext-DGV-E-HY.js";import{a as v,c as y,f as b,h as x,l as S,o as C,u as w}from"./zod-IH1ygGIO.js";import{s as T}from"./canvasWebRequestUtils-DXZ-FDOZ.js";import{a as E,d as D,i as ee,l as O,n as te,r as ne,s as k,t as A,u as j}from"./canvasAssignmentHooks-BN_sxrOD.js";import{n as M}from"./canvasAssignmentService-D5TSBW1F.js";import{r as N,t as P}from"./assignmentSubmissionType-DBpY39dZ.js";import{a as F,i as I,n as L,o as re,r as R,t as z}from"./EditLayout-gwLM8f_o.js";var B=C({label:y(),points:v()}),V=e=>e.label.toLowerCase().includes(`(extra credit)`),H=e=>{let t=[],n=/- (.+)/,r=e.split(`AllowedFileUploadExtensions:`);if(r.length<2)return t;let i=r[1].split(`
`).map(e=>e.trim());for(let e of i){let r=n.exec(e);if(!r){if(e===``)continue;break}t.push(r[1].trim())}return t},U=e=>{let t=/\s*-\s*(-?\d+(?:\.\d+)?)\s*pt(s)?:/.exec(e);if(!t)throw Error(`Points not found: ${e}`);return{points:parseFloat(t[1]),label:e.split(`: `).slice(1).join(`: `)}},W=e=>{let t=F(e,`LockAt`),n=F(e,`DueAt`),r=F(e,`AssignmentGroupName`),i=G(e),a=H(e),o=F(e,`GithubClassroomAssignmentShareLink`),s=F(e,`GithubClassroomAssignmentLink`);return{assignmentGroupName:r,submissionTypes:i,fileUploadExtensions:a,dueAt:m(n,`DueAt`),lockAt:g(t),githubClassroomAssignmentShareLink:o,githubClassroomAssignmentLink:s}},G=e=>{let t=[],n=/- (.+)/,r=e.split(`SubmissionTypes:`);if(r.length<2)return t;let i=r[1].split(`
`).map(e=>e.trim());for(let e of i){let r=n.exec(e);if(!r){if(e===``)continue;break}let i=r[1].trim(),a=Object.values(P).find(e=>e===i);a?t.push(a):console.warn(`Unknown submission type: ${i}`)}return t},K=e=>e.trim()?e.trim().split(`
`).map(U):[],q={parseRubricMarkdown:K,parseMarkdown(e,t){let n=e.split(`---`)[0],{assignmentGroupName:r,submissionTypes:i,fileUploadExtensions:a,dueAt:o,lockAt:s,githubClassroomAssignmentShareLink:c,githubClassroomAssignmentLink:l}=W(n),u=e.split(`---
`).slice(1).join(`---
`).split(`## Rubric`)[0].trim(),d=e.split(`## Rubric
`)[1],f=K(d),p={name:t,localAssignmentGroupName:r.trim(),submissionTypes:i,allowedFileUploadExtensions:a,dueAt:o,lockAt:s,rubric:f,description:u};return c&&(p.githubClassroomAssignmentShareLink=c),l&&(p.githubClassroomAssignmentLink=l),p}},J=e=>e.rubric.map(e=>{let t=e.points>1?`pts`:`pt`;return`- ${e.points}${t}: ${e.label}`}).join(`
`),Y=e=>{let t=e.dueAt.toString().replace(` `,` `),n=e.lockAt?.toString().replace(` `,` `)||``,r=e.submissionTypes.map(e=>`- ${e}`).join(`
`),i=e.allowedFileUploadExtensions.map(e=>`- ${e}`).join(`
`);return[`LockAt: ${n}`,`DueAt: ${t}`,`AssignmentGroupName: ${e.localAssignmentGroupName}`,`GithubClassroomAssignmentLink: ${e.githubClassroomAssignmentLink??``}`,`GithubClassroomAssignmentShareLink: ${e.githubClassroomAssignmentShareLink??``}`,`SubmissionTypes:\n${r}`,`AllowedFileUploadExtensions:\n${i}`].join(`
`)},ie={toMarkdown(e){try{let t=Y(e),n=J(e);return`${t}\n---\n\n${e.description}\n\n## Rubric\n\n${n}`}catch(t){throw console.log(e),console.log(`Error converting assignment to markdown`),t}}};C({name:y(),description:y(),lockAt:y().optional(),dueAt:y(),localAssignmentGroupName:y().optional(),submissionTypes:N.array(),allowedFileUploadExtensions:y().array(),rubric:B.array(),githubClassroomAssignmentShareLink:y().optional(),githubClassroomAssignmentLink:y().optional()});var X={parseMarkdown:q.parseMarkdown,toMarkdown:ie.toMarkdown},Z=e(t(),1);function Q(e){let t=typeof e==`string`?new Date(e):e;return isNaN(t.getTime())?`Invalid date`:t.toLocaleString(void 0,{weekday:`short`,month:`short`,day:`numeric`,hour:`2-digit`,minute:`2-digit`})}var $=n();function ae({assignment:e}){let t=M(e.rubric),n=e.rubric.reduce((e,t)=>V(t)?e+t.points:e,0);return(0,$.jsxs)(`div`,{className:`h-full overflow-y-auto `,children:[(0,$.jsxs)(`section`,{children:[(0,$.jsxs)(`div`,{className:`flex`,children:[(0,$.jsx)(`div`,{className:`flex-1 text-end pe-3`,children:`Due Date`}),(0,$.jsx)(`div`,{className:`flex-1`,children:Q(e.dueAt)})]}),(0,$.jsxs)(`div`,{className:`flex`,children:[(0,$.jsx)(`div`,{className:`flex-1 text-end pe-3`,children:`Lock Date`}),(0,$.jsx)(`div`,{className:`flex-1`,children:e.lockAt&&Q(e.lockAt)})]}),(0,$.jsxs)(`div`,{className:`flex`,children:[(0,$.jsx)(`div`,{className:`flex-1 text-end pe-3`,children:`Assignment Group Name`}),(0,$.jsx)(`div`,{className:`flex-1`,children:e.localAssignmentGroupName})]}),(0,$.jsxs)(`div`,{className:`flex`,children:[(0,$.jsx)(`div`,{className:`flex-1 text-end pe-3`,children:`Submission Types`}),(0,$.jsx)(`div`,{className:`flex-1`,children:(0,$.jsx)(`ul`,{className:``,children:e.submissionTypes.map(e=>(0,$.jsx)(`li`,{children:e},e))})})]}),(0,$.jsxs)(`div`,{className:`flex`,children:[(0,$.jsx)(`div`,{className:`flex-1 text-end pe-3`,children:`File Upload Types`}),(0,$.jsx)(`div`,{className:`flex-1`,children:(0,$.jsx)(`ul`,{className:``,children:e.allowedFileUploadExtensions.map(e=>(0,$.jsx)(`li`,{children:e},e))})})]})]}),(0,$.jsx)(`br`,{}),(0,$.jsx)(`hr`,{}),(0,$.jsx)(`br`,{}),(0,$.jsx)(`section`,{children:(0,$.jsx)(i,{markdown:e.description,replaceText:[{source:`insert_github_classroom_url`,destination:e.githubClassroomAssignmentShareLink||``}]})}),(0,$.jsx)(`hr`,{}),(0,$.jsxs)(`section`,{children:[(0,$.jsxs)(`h2`,{className:`text-center`,children:[`Rubric - `,t,` Points`]}),n!==0&&(0,$.jsxs)(`h5`,{className:`text-center`,children:[n,` Extra Credit Points`]}),(0,$.jsx)(`div`,{className:`grid grid-cols-[auto_auto_1fr]`,children:e.rubric.map((e,t)=>(0,$.jsxs)(Z.Fragment,{children:[(0,$.jsx)(`div`,{className:`text-end pe-1`,children:V(e)?`Extra Credit`:``}),(0,$.jsx)(`div`,{className:`text-end pe-3`,children:e.points}),(0,$.jsx)(`div`,{children:e.label})]},e.label+t))})]})]})}function oe({moduleName:e,assignmentName:t,toggleHelp:n}){let r=o(),i=d(),{courseName:a}=_(),{data:s}=h(),{data:l,isFetching:p}=ne(),m=u(),{data:g,isFetching:v}=k(e,t),y=te(),x=ee(),C=E(),T=O(),[D,j]=(0,Z.useState)(!1),M=w(),{previousUrl:N,nextUrl:P}=I(`assignment`,t,e),F=l?.find(e=>e.name===t),L=y.isPending||p||v||x.isPending||C.isPending;return(0,$.jsxs)(`div`,{className:`p-5 flex flex-row justify-between gap-3`,children:[(0,$.jsx)(`div`,{children:(0,$.jsx)(`button`,{onClick:n,children:`Toggle Help`})}),(0,$.jsxs)(`div`,{className:`flex flex-row gap-3 justify-end`,children:[L&&(0,$.jsx)(c,{}),F&&!F?.published&&(0,$.jsx)(`div`,{className:`text-rose-300 my-auto`,children:`Not Published`}),!F&&(0,$.jsx)(`button`,{disabled:y.isPending,onClick:()=>y.mutate({assignment:g,moduleName:e}),children:`Add to canvas`}),F&&(0,$.jsx)(`a`,{className:`btn`,target:`_blank`,href:`https://snow.instructure.com/courses/${s.canvasId}/assignments/${F.id}`,onClick:()=>{for(let e=1;e<=8;e+=2)setTimeout(()=>{m.invalidateQueries({queryKey:A.assignments(s.canvasId)})},e*1e3)},children:`View in Canvas`}),F&&(0,$.jsx)(`button`,{className:``,disabled:x.isPending,onClick:()=>C.mutate({canvasAssignmentId:F.id,assignment:g}),children:`Update in Canvas`}),F&&(0,$.jsx)(`button`,{className:`btn-danger`,disabled:x.isPending,onClick:()=>x.mutate({canvasAssignmentId:F.id,assignmentName:g.name}),children:`Delete from Canvas`}),!F&&(0,$.jsx)(S,{modalControl:M,buttonText:`Delete Localy`,buttonClass:`btn-danger`,modalWidth:`w-1/5`,children:({closeModal:n})=>(0,$.jsxs)(`div`,{children:[(0,$.jsx)(`div`,{className:`text-center`,children:`Are you sure you want to delete this assignment locally?`}),(0,$.jsx)(`br`,{}),(0,$.jsxs)(`div`,{className:`flex justify-around gap-3`,children:[(0,$.jsx)(`button`,{onClick:async()=>{r({to:b(a)}),j(!0),await T.mutateAsync({moduleName:e,assignmentName:t,courseName:a}),i.invalidate()},disabled:T.isPending||D,className:`btn-danger`,children:`Yes`}),(0,$.jsx)(`button`,{onClick:n,disabled:T.isPending||D,children:`No`})]}),(T.isPending||D)&&(0,$.jsx)(c,{})]})}),(0,$.jsx)(f,{className:`btn`,to:b(a),children:`Go Back`}),(0,$.jsx)(R,{previousUrl:N,nextUrl:P})]})]})}function se({moduleName:e,assignmentName:t}){let n=w(),{courseName:r}=_(),i=o(),{data:a}=k(e,t),s=j(),[l,u]=(0,Z.useState)(a.name),[d,f]=(0,Z.useState)(!1);return(0,$.jsx)(`div`,{children:(0,$.jsx)(S,{modalControl:n,buttonText:`Rename Assignment`,buttonClass:`py-0`,modalWidth:`w-1/5`,children:({closeModal:n})=>(0,$.jsxs)(`form`,{onSubmit:async o=>{o.preventDefault(),l===t&&n(),f(!0);try{await s.mutateAsync({assignment:a,moduleName:e,assignmentName:l,previousModuleName:e,previousAssignmentName:t,courseName:r}),i({to:x(r,e,`assignment`,l),replace:!0})}finally{f(!1)}},children:[(0,$.jsx)(`div`,{className:`
                text-yellow-300 
                bg-yellow-950/30 
                border-2 
                rounded-lg 
                border-yellow-800 
                p-1 text-sm mb-2`,children:`Warning: does not rename in Canvas`}),(0,$.jsx)(T,{value:l,setValue:u,label:`Rename Assignment`}),(0,$.jsx)(`button`,{className:`w-full my-3`,children:`Save New Name`}),d&&(0,$.jsx)(c,{})]})})})}function ce({moduleName:e,assignmentName:t}){return(0,$.jsxs)(`div`,{className:`py-1 flex flex-row justify-between`,children:[(0,$.jsxs)(`div`,{className:`flex flex-row`,children:[(0,$.jsx)(a,{}),(0,$.jsx)(`span`,{className:`text-slate-500 cursor-default select-none my-auto`,children:(0,$.jsx)(r,{})}),(0,$.jsx)(`div`,{className:`my-auto px-3`,children:t})]}),(0,$.jsx)(`div`,{className:`px-1`,children:(0,$.jsx)(se,{assignmentName:t,moduleName:e})})]})}function le(e){return`
Assignment Group Names:
- ${e.assignmentGroups.map(e=>e.name).join(`
- `)}
SubmissionTypes:
- ${P.ONLINE_TEXT_ENTRY}
- ${P.ONLINE_UPLOAD}
- ${P.DISCUSSION_TOPIC}
AllowedFileUploadExtensions:
- pdf
- jpg
- jpeg
- png
---

description goes here


## Markdown
You can use markdown to format your assignment description. For example, you can make lists like this:
- Item 1
- Item 2
- Item 3

**Bold text**

*Italic text*

[Link to Canvas](https://canvas.instructure.com)


\`Inline code\`

> Blockquote

---

1. First item
2. Second item
3. Third item

you can make mermaid diagrams like this:

\`\`\`mermaid
flowchart TD
    A[Christmas] -->|Get money| B(Go shopping)
    B --> C{Let me think}
    C -->|One| D[Laptop]
    C -->|Two| E[iPhone]
    C -->|Three| F[fa:fa-car Car]
\`\`\`

## LaTeX Math

**Inline math:** The Fibonacci sequence is defined as: \$F(n) = F(n-1) + F(n-2)\$ where \$F(0) = 0\$ and \$F(1) = 1\$.

**Block math:**
\$\$F(n) = F(n-1) + F(n-2)\$\$

**Complex equations:**
\$\$
F(n) = \\begin{cases} 
0 & \\text{if } n = 0 \\\\
1 & \\text{if } n = 1 \\\\
F(n-1) + F(n-2) & \\text{if } n > 1
\\end{cases}
\$\$

## github classroom links will be replaced by the GithubClassroomAssignmentShareLink setting

[Github Classroom](insert_github_classroom_url)

## Files

If you have mounted a folder in the /app/public/images directory, you can link to files like this:

![formulas](/images/facultyFiles/1405/lab-04-simple-math-formulas.png)

## Rubric

- 1pt: singular point
- 1pts: plural points
- 10pts: (extra credit) extra credit points
- 10pts: (Extra Credit) Caps also works`}function ue({moduleName:e,assignmentName:t}){let{courseName:n}=_(),{data:r}=h(),{data:i,dataUpdatedAt:a,isFetching:o}=k(e,t),l=j(),{isPending:u}=D({moduleName:e,assignmentName:t}),{clientIsAuthoritative:d,text:f,textUpdate:m,monacoKey:g,serverUpdatedAt:v,clientDataUpdatedAt:y}=L({serverUpdatedAt:a,startingText:X.toMarkdown(i)}),[b,x]=(0,Z.useState)(``),[S,C]=(0,Z.useState)(!1);return(0,Z.useEffect)(()=>{let r=setTimeout(()=>{try{if(o||l.isPending){console.log(`network requests in progress, not updating assignments`);return}let r=X.parseMarkdown(f,t);X.toMarkdown(i)!==X.toMarkdown(r)&&(d?(console.log(`updating assignment, client is authoritative`),l.mutateAsync({assignment:r,moduleName:e,assignmentName:t,previousModuleName:e,previousAssignmentName:t,courseName:n})):(console.log(`client not authoritative, updating client with server assignment`,`client updated`,y,`server updated`,v),m(X.toMarkdown(i),!0))),x(``)}catch(e){x(e.toString())}},500);return()=>{clearTimeout(r)}},[i,t,y,d,n,o,e,v,f,m,l]),(0,$.jsx)(z,{Header:(0,$.jsx)(ce,{moduleName:e,assignmentName:t}),Body:(0,$.jsxs)($.Fragment,{children:[S&&(0,$.jsxs)(`div`,{className:` max-w-96 flex-1 h-full overflow-y-auto`,children:[(0,$.jsx)(`pre`,{children:(0,$.jsx)(`code`,{children:le(r)})}),(0,$.jsx)(`a`,{href:`https://www.markdownguide.org/cheat-sheet/`,target:`_blank`,className:`text-blue-400 underline`,children:`Markdown Cheat Sheet`}),(0,$.jsx)(`a`,{href:`https://mermaid.live/edit`,target:`_blank`,className:`text-blue-400 underline ps-3`,children:`Mermaid Live Editor`})]}),(0,$.jsx)(`div`,{className:`flex-1 h-full`,children:(0,$.jsx)(re,{value:f,onChange:m},g)}),(0,$.jsxs)(`div`,{className:`flex-1 h-full`,children:[(0,$.jsx)(`div`,{className:`text-red-300`,children:b&&b}),(0,$.jsx)(`div`,{className:`px-3 h-full `,children:(0,$.jsx)(p,{children:(0,$.jsxs)(s,{showToast:!1,children:[u&&(0,$.jsxs)(`div`,{className:`flex justify-center`,children:[(0,$.jsx)(c,{}),` images being uploaded to canvas`]}),(0,$.jsx)(ae,{assignment:i})]})})})]})]}),Footer:(0,$.jsx)(p,{children:(0,$.jsx)(s,{children:(0,$.jsx)(oe,{moduleName:e,assignmentName:t,toggleHelp:()=>C(e=>!e)})})})})}function de(){let{moduleName:e,assignmentName:t}=l.useParams();return(0,$.jsx)(ue,{assignmentName:decodeURIComponent(t),moduleName:decodeURIComponent(e)})}export{de as component};