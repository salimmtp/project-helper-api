const db = require('../util/db');
const projectModel = require('../model/project');

// @method : POST
// @desc   : add project
exports.add = async (req, res) => {
  try {
    const { id } = req.decoded;
    const { topic, description, level, skills, department } = req.body;
    await projectModel.add(
      {
        topic,
        description,
        level,
        skills,
        user_id: id
      },
      department
    );
    res.json({ message: 'project added.' });
  } catch (e) {
    console.log({ e });
    res.status(500).json({ message: 'server error' });
  }
};

// @method : POST
// @desc   : update project
exports.update = async (req, res) => {
  try {
    const { id: userId } = req.decoded;
    const { topic, description, level, skills, department } = req.body;
    await projectModel.add(
      {
        topic,
        description,
        level,
        skills,
        user_id: id
      },
      department
    );
    res.json({ message: 'project added.' });
  } catch (e) {
    console.log({ e });
    res.status(500).json({ message: 'server error' });
  }
};

// @method : GET
// @desc   : list of project based on user department selection
//           default pagination query values (page:0, limit:10)
exports.list = async (req, res) => {
  try {
    const { id } = req.decoded;
    const { limit, page } = req.query;
    const data = await projectModel.list(page, limit, id);
    res.json({ message: 'projects', data });
  } catch (e) {
    console.log({ e });
    res.status(500).json({ message: 'server error' });
  }
};

// @method : GET
// @desc   : list of all project based on the query filter, explore
exports.explore = async (req, res) => {
  try {
    const { id } = req.decoded;
    const { limit, page } = req.query;
    const data = await projectModel.search(page, limit, { ...req.query }, id);
    res.json({ message: 'projects', data });
  } catch (e) {
    console.log({ e });
    res.status(500).json({ message: 'server error' });
  }
};

// @method : GET
// @desc   : complete data of project based on the project id passed
exports.projectById = async (req, res) => {
  try {
    const { id } = req.params;
    const { id: userId } = req.decoded;
    const [data] = await projectModel.projectById(id, userId);
    if (!data[0].length) return res.status(403).json({ message: 'data not found' });

    for (item in data[1]) {
      let [resultData] = await projectModel.commentReplys(data[1][item].id, userId);
      data[1][item].replies = resultData;
    }
    console.log({ d: data[0][0] });
    res.json({ message: 'projects', data: data[0][0], comments: data[1] });
  } catch (e) {
    console.log({ e });
    res.status(500).json({ message: 'server error' });
  }
};

// @method : POST
// @desc   : delete project
exports.deleteProject = async (req, res) => {
  try {
    const { id: projectId } = req.params;
    const { id: userId } = req.decoded;

    const [isBelong] = await projectModel.isProjectBelongToUser(projectId, userId);
    // verify project belong to the requesting user
    if (!isBelong.length) return res.status(403).json({ message: 'permission denied' });
    await projectModel.delete(isBelong[0].id);

    res.json({ message: 'project deleted' });
  } catch (e) {
    console.log({ e });
    res.status(500).json({ message: 'server error' });
  }
};

// @method : GET
// @desc   : auto complete search keyword based on the query passed
// @return : List of department, users, project max 6 based on the query passed
exports.searchList = async (req, res) => {
  try {
    const { search } = req.query;
    const [departments] = await projectModel.departments(search);
    const [users] = await projectModel.searchUsers(search);
    const projects = await projectModel.search(0, 6, { search });
    res.json({
      message: 'search list',
      data: {
        departments,
        users,
        projects: projects.data
      }
    });
  } catch (e) {
    res.status(500).json({ message: 'server error' });
  }
};

// @method  : GET
// @desc    : Projects created by user
exports.myProjects = async (req, res) => {
  try {
    const { id } = req.decoded;
    const { page, limit } = req.query;
    const data = await projectModel.search(page, limit, { userId: id }, id);
    res.json({ message: 'My Projects', data });
  } catch (error) {
    // console.log({ error });
    res.status(500).json({ message: 'server error' });
  }
};

//  -----------------------------------------------------------------------------------------------------
//  ----------------------------------- Project related actions -----------------------------------------
//  -----------------------------------------------------------------------------------------------------

// @method  : POST
// @desc    : commenting to a project
exports.comment = async (req, res) => {
  try {
    const { id: userId, name } = req.decoded;
    const { projectId, comment, replyTo = 0 } = req.body;

    const [isProjectExist] = await projectModel.isProjectExist(projectId);
    if (!isProjectExist.length) return res.status(403).json({ message: 'Project id not found' });

    await projectModel.comment(
      { comment, project_id: projectId, replyTo, user_id: userId },
      `${name} commented "${comment}" on your topic: "${isProjectExist[0].topic}".`,
      isProjectExist[0].user_id
    );

    res.json({ message: 'comment successful' });
  } catch (error) {
    // console.log({ error });
    res.status(500).json({ message: 'server error' });
  }
};

// @method  : POST
// @desc    : comment deletion by id
exports.deleletComment = async (req, res) => {
  try {
    const { id: userId } = req.decoded;
    const { id } = req.body;
    await projectModel.deleteComment(id, userId);

    res.json({ message: 'comment removed' });
  } catch (error) {
    // console.log({ error });
    res.status(500).json({ message: 'server error' });
  }
};

// @method  : POST
// @desc    : up vote the project
exports.upVote = async (req, res) => {
  try {
    const { id: userId, name } = req.decoded;
    const { id } = req.body;

    const [isProjectExist] = await projectModel.isProjectExist(id);
    if (!isProjectExist.length) return res.status(403).json({ message: 'Project id not found' });

    const isExist = await projectModel.isupVoteExist(userId, id);
    if (isExist) await projectModel.deleteUpVote(userId, id);
    else
      await projectModel.addUpVote(
        userId,
        id,
        `${name} upvoted your topic: "${isProjectExist[0].topic}".`,
        isProjectExist[0].user_id
      );

    res.json({ message: isExist ? 'removed' : 'Upvoted the project' });
  } catch (error) {
    res.status(500).json({ message: 'server error' });
  }
};

// @method  : POST
// @desc    : Follow user
exports.followUser = async (req, res) => {
  try {
    const { id, name } = req.decoded;
    const { user } = req.body;
    const isExist = await projectModel.isUserFollowingExist(id, user);
    if (isExist) await projectModel.unfollow(id, user);
    else await projectModel.follow(id, user, `${name} has started following you.`);
    res.json({ message: isExist ? 'unfollowed' : 'Followed' });
  } catch (error) {
    console.log({ error });
    res.status(500).json({ message: 'server error' });
  }
};

// @method : GET
// @desc   : list of all project based on the query filter, explore
exports.followingUserProjectList = async (req, res) => {
  try {
    const { id } = req.decoded;
    const { limit, page } = req.query;
    const data = await projectModel.followingProjectList(page, limit, id);
    res.json({ message: 'projects', data });
  } catch (e) {
    console.log({ e });
    res.status(500).json({ message: 'server error' });
  }
};
